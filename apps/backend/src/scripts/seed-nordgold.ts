import { ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  deleteProductsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows";
import { readFileSync } from "fs";
import { extractBrand } from "../lib/brands";
import { updateCategoryCounts } from "../lib/category-counts";
import { join } from "path";

type Row = {
  code: string;
  description: string;
  brand: string | null;
  equipment: string | null;
  type: string | null;
  mpn: string | null;
  unit: string;
  country: string;
  mine: string;
  location: string;
  qty: number;
};

const CLIENT = "Nordgold";
const COUNTRY_CODES: Record<string, string> = {
  "Burkina Faso": "BF",
  Guinea: "GN",
};

// Same placeholders as setup-markets.ts.
const SHIPPING_XOF = { standard: 5000, express: 15000 };
const SHIPPING_USD = { standard: 8, express: 25 };

const BATCH = 50;

// Usage (from apps/backend):
//   NORDGOLD_FILE=seed/nordgold-ouagadougu.json [NORDGOLD_LIMIT=200] \
//     pnpm medusa exec ./src/scripts/seed-nordgold.ts
// Adds products to the catalog without touching existing ones. Re-runnable:
// products whose handle already exists are skipped. No prices are set
// (quote-only); stock goes to a "Nordgold <location>" warehouse.
export default async function seedNordgold({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const fulfillment = container.resolve(Modules.FULFILLMENT);
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL);

  const file = process.env.NORDGOLD_FILE ?? "seed/nordgold-ouagadougu.json";
  const limit = Number(process.env.NORDGOLD_LIMIT ?? 0);
  let rows: Row[] = JSON.parse(readFileSync(join(process.cwd(), file), "utf-8"));
  if (limit) rows = rows.slice(0, limit);
  logger.info(`Nordgold: ${rows.length} products from ${file}`);

  const [salesChannel] = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  });

  // --- Warehouses: "Nordgold " + location column value ---------------------
  const zoneCountries: string[] = (
    await container
      .resolve(ContainerRegistrationKeys.PG_CONNECTION)
      .raw("select iso_2 from region_country order by iso_2")
  ).rows.map((r: any) => r.iso_2);
  const profiles = await fulfillment.listShippingProfiles({ type: "default" });
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "currency_code"],
  });

  const locationIds = new Map<string, string>();
  for (const loc of [...new Set(rows.map((r) => `${CLIENT} ${r.location}`))]) {
    const src = rows.find((r) => `${CLIENT} ${r.location}` === loc)!;
    const { data: found } = await query.graph({
      entity: "stock_location",
      fields: ["id"],
      filters: { name: loc },
    });
    let stockLocationId: string;
    if (found.length) {
      stockLocationId = found[0].id;
    } else {
      logger.info(`Creating warehouse "${loc}"...`);
      const {
        result: [stockLocation],
      } = await createStockLocationsWorkflow(container).run({
        input: {
          locations: [
            {
              name: loc,
              address: {
                country_code: COUNTRY_CODES[src.country] ?? "BF",
                city: src.location,
                address_1: "",
              },
            },
          ],
        },
      });
      stockLocationId = stockLocation.id;
      if (salesChannel) {
        await linkSalesChannelsToStockLocationWorkflow(container).run({
          input: { id: stockLocationId, add: [salesChannel.id] },
        });
      }
      await link.create({
        [Modules.STOCK_LOCATION]: { stock_location_id: stockLocationId },
        [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
      });
    }
    locationIds.set(loc, stockLocationId);

    // Fulfillment set + shipping options, so carts holding these items can ship.
    const setName = `${loc} delivery`;
    const [haveSet] = await fulfillment.listFulfillmentSets({ name: setName });
    if (haveSet) continue;
    logger.info(`Creating shipping for "${loc}"...`);
    const fulfillmentSet = await fulfillment.createFulfillmentSets({
      name: setName,
      type: "shipping",
      service_zones: [
        {
          name: `${loc} Worldwide`,
          geo_zones: zoneCountries.map((country_code) => ({
            country_code,
            type: "country" as const,
          })),
        },
      ],
    });
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: stockLocationId },
      [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
    });
    const rules = [
      { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
      { attribute: "is_return", value: "false", operator: "eq" as const },
    ];
    const option = (
      code: "standard" | "express",
      label: string,
      description: string
    ) => ({
      name: `${label} Shipping`,
      price_type: "flat" as const,
      provider_id: "manual_manual",
      service_zone_id: fulfillmentSet.service_zones[0].id,
      shipping_profile_id: profiles[0].id,
      type: { label, description, code },
      prices: [
        { currency_code: "xof", amount: SHIPPING_XOF[code] },
        { currency_code: "usd", amount: SHIPPING_USD[code] },
        ...regions.map((r) => ({
          region_id: r.id,
          amount:
            r.currency_code === "xof" ? SHIPPING_XOF[code] : SHIPPING_USD[code],
        })),
      ],
      rules,
    });
    await createShippingOptionsWorkflow(container).run({
      input: [
        option("standard", "Standard", "Ship in 2-3 days."),
        option("express", "Express", "Ship in 24 hours."),
      ],
    });
  }

  // --- Categories from the sheet's "Type" column ---------------------------
  const types = [...new Set(rows.map((r) => r.type).filter(Boolean))] as string[];
  const { data: existingCats } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  });
  const categoryIds = new Map(existingCats.map((c) => [c.name, c.id]));
  const missing = types.filter((t) => !categoryIds.has(t));
  if (missing.length) {
    const { result } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: missing.map((name) => ({ name, is_active: true })),
      },
    });
    result.forEach((c) => categoryIds.set(c.name, c.id));
  }

  // --- Products (skip handles that already exist) ---------------------------
  const handleOf = (r: Row) => `nordgold-${r.code}`.toLowerCase();
  const { data: existing } = await query.graph({
    entity: "product",
    fields: ["handle"],
    filters: { handle: rows.map(handleOf) },
  });
  const have = new Set(existing.map((p) => p.handle));
  const todo = rows.filter((r) => !have.has(handleOf(r)));
  logger.info(`${have.size} already present, creating ${todo.length}...`);

  // One batch: create the products, then stock them. Wrapped so a dropped
  // connection retries the batch instead of ending a multi-hour run.
  const processChunk = async (chunk: Row[]) => {
    await createProductsWorkflow(container).run({
      input: {
        products: chunk.map((r) => ({
          title: r.description,
          handle: handleOf(r),
          status: ProductStatus.PUBLISHED,
          category_ids: r.type && categoryIds.has(r.type) ? [categoryIds.get(r.type)!] : [],
          sales_channels: salesChannel ? [{ id: salesChannel.id }] : [],
          metadata: {
            client: CLIENT,
            g_code: r.code,
            brand: r.brand ?? extractBrand(r.description),
            equipment: r.equipment,
            manufacturer_part_number: r.mpn,
            unit: r.unit,
            mine: r.mine,
            country: r.country,
            location: r.location,
            qty_available: r.qty,
          },
          options: [{ title: "Unit", values: [r.unit] }],
          variants: [
            {
              title: r.unit,
              sku: r.code,
              options: { Unit: r.unit },
              manage_inventory: true,
              prices: [],
            },
          ],
        })),
      },
    });

    // Stock the new variants at their warehouse.
    const { data: variants } = await query.graph({
      entity: "product_variant",
      fields: ["sku", "inventory_items.inventory_item_id"],
      filters: { sku: chunk.map((r) => r.code) },
    });
    const bySku = new Map(chunk.map((r) => [r.code, r]));
    const levels = variants.flatMap((v) => {
      const r = bySku.get(v.sku!);
      if (!r) return [];
      return (v.inventory_items ?? []).map((ii: any) => ({
        location_id: locationIds.get(`${CLIENT} ${r.location}`)!,
        inventory_item_id: ii.inventory_item_id,
        stocked_quantity: r.qty,
      }));
    });
    if (levels.length) {
      await createInventoryLevelsWorkflow(container).run({
        input: { inventory_levels: levels },
      });
    }
  }

  for (let i = 0; i < todo.length; i += BATCH) {
    const chunk = todo.slice(i, i + BATCH);
    for (let attempt = 1; ; attempt++) {
      try {
        await processChunk(chunk);
        break;
      } catch (error) {
        if (attempt >= 5) throw error;
        logger.warn(
          `Batch at ${i} failed (attempt ${attempt}/5): ${
            error instanceof Error ? error.message : error
          }. Cleaning up and retrying in ${attempt * 15}s...`
        );
        // Remove any products from this batch that were left without variants.
        const { data: partial } = await query.graph({
          entity: "product",
          fields: ["id", "variants.id"],
          filters: { handle: chunk.map(handleOf) },
        });
        const broken = partial.filter((p: any) => !p.variants?.length);
        if (broken.length) {
          await deleteProductsWorkflow(container).run({
            input: { ids: broken.map((p: any) => p.id) },
          });
        }
        await new Promise((r) => setTimeout(r, attempt * 15000));
      }
    }
    if ((i / BATCH) % 10 === 0 || i + BATCH >= todo.length) {
      logger.info(`  ${Math.min(i + BATCH, todo.length)}/${todo.length}`);
    }
  }
  await updateCategoryCounts(container);
  logger.info("Finished seeding Nordgold products.");
}
