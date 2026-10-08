import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  deleteInventoryItemWorkflow,
  createProductsWorkflow,
  deleteProductCategoriesWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows";
import { ProductStatus } from "@medusajs/framework/utils";
import { readFileSync } from "fs";
import { extractBrand } from "../lib/brands";
import { categoryFor, CATEGORIES } from "../lib/categories";
import { updateCategoryCounts } from "../lib/category-counts";
import {
  MARKUP_PERCENT,
  VAT_PERCENT,
  waghionPrices,
} from "../lib/waghion-pricing";
import { join } from "path";

type Row = {
  code: string;
  dup: number;
  description: string | null;
  gtin: string | null;
  group: string | null;
  qty: number;
  unit: string | null;
  condition: string | null;
  equipment: string | null;
  equipment_model: string | null;
  equipment_serial: string | null;
  unit_price_xof: number;
};

const WAREHOUSE_NAME = "Waghion Warehouse";

// Usage: pnpm medusa exec ./src/scripts/seed-products.ts
export default async function seedProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL);
  const productService = container.resolve(Modules.PRODUCT);

  const rows: Row[] = JSON.parse(
    readFileSync(join(process.cwd(), "seed", "products.json"), "utf-8")
  );

  const { data: locations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
    filters: { name: WAREHOUSE_NAME },
  });
  if (!locations.length) {
    throw new Error(
      `Stock location "${WAREHOUSE_NAME}" not found; run setup-markets.ts first.`
    );
  }
  const warehouse = locations[0];

  // This script wipes the whole catalog first; refuse once other clients' items exist.
  const { data: others } = await query.graph({
    entity: "product",
    fields: ["id"],
    filters: { handle: { $like: "nordgold-%" } } as any,
  });
  if (others.length) {
    throw new Error(
      "Nordgold products exist; this script would delete them. " +
        "Use update-waghion-prices.ts to change prices instead."
    );
  }

  logger.info("Removing existing products and categories...");
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id"],
  });
  if (existingProducts.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: existingProducts.map((p) => p.id) },
    });
  }
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id"],
  });
  if (existingCategories.length) {
    await deleteProductCategoriesWorkflow(container).run({
      input: existingCategories.map((c) => c.id),
    });
  }
  const { data: existingInventory } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });
  if (existingInventory.length) {
    await deleteInventoryItemWorkflow(container).run({
      input: existingInventory.map((i) => i.id),
    });
  }
  const existingCollections = await productService.listProductCollections();
  if (existingCollections.length) {
    await productService.deleteProductCollections(
      existingCollections.map((c) => c.id)
    );
  }

  const [salesChannel] = await salesChannelService.listSalesChannels({
    name: "Default Sales Channel",
  });

  const groups = [...CATEGORIES] as string[];
  const { result: categories } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: groups.map((name) => ({ name, is_active: true })),
    },
  });

  logger.info(`Seeding ${rows.length} products...`);
  const products = rows.map((r) => {
    const suffix = r.dup > 1 ? `-${r.dup}` : "";
    const sku = `${r.code}${suffix}`;
    const { xof, usd } = waghionPrices(r.unit_price_xof);
    return {
      title: r.description ?? sku,
      handle: `item-${sku}`.toLowerCase(),
      status: ProductStatus.PUBLISHED,
      category_ids: categories
        .filter((c) => c.name === categoryFor("waghion", r.group))
        .map((c) => c.id),
      sales_channels: salesChannel ? [{ id: salesChannel.id }] : [],
      metadata: {
        item_code: r.code,
        brand: extractBrand(r.description ?? ""),
        gtin: r.gtin,
        unit: r.unit,
        condition: r.condition,
        qty_available: r.qty,
        equipment: r.equipment,
        equipment_model: r.equipment_model,
        equipment_serial: r.equipment_serial,
        unit_price_xof: r.unit_price_xof,
        markup_percent: MARKUP_PERCENT,
        vat_percent: VAT_PERCENT,
      },
      options: [{ title: "Unit", values: [r.unit ?? "EACH"] }],
      variants: [
        {
          title: r.unit ?? "EACH",
          sku,
          options: { Unit: r.unit ?? "EACH" },
          manage_inventory: true,
          prices: [
            { amount: xof, currency_code: "xof" },
            { amount: usd, currency_code: "usd" },
          ],
        },
      ],
    };
  });

  const batchSize = 50;
  for (let i = 0; i < products.length; i += batchSize) {
    await createProductsWorkflow(container).run({
      input: { products: products.slice(i, i + batchSize) },
    });
    logger.info(`  ${Math.min(i + batchSize, products.length)}/${products.length}`);
  }
  logger.info(`Stocking ${WAREHOUSE_NAME}...`);
  const qtyBySku = new Map(
    rows.map((r) => [`${r.code}${r.dup > 1 ? `-${r.dup}` : ""}`, r.qty])
  );
  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["sku", "inventory_items.inventory_item_id"],
  });
  const levels = variants.flatMap((v) =>
    (v.inventory_items ?? []).map((ii: any) => ({
      location_id: warehouse.id,
      inventory_item_id: ii.inventory_item_id,
      stocked_quantity: qtyBySku.get(v.sku!) ?? 0,
    }))
  );
  for (let i = 0; i < levels.length; i += batchSize) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: levels.slice(i, i + batchSize) },
    });
  }
  await updateCategoryCounts(container);
  logger.info(`Finished seeding products (${levels.length} stocked).`);
}
