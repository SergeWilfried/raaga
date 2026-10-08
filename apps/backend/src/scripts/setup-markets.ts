import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import {
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createTaxRegionsWorkflow,
  deleteShippingOptionsWorkflow,
  deleteTaxRegionsWorkflow,
  updateRegionsWorkflow,
  updateStockLocationsWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

// WAEMU / UEMOA countries sharing the CFA franc (XOF).
const XOF_COUNTRIES = ["bj", "bf", "ci", "gw", "ml", "ne", "sn", "tg"];

export const WAREHOUSE_NAME = "Waghion Warehouse";

// Flat shipping rates: placeholders, adjust to your real rates.
const SHIPPING_XOF = { standard: 5000, express: 15000 };
const SHIPPING_USD = { standard: 8, express: 25 };

// Usage: pnpm medusa exec ./src/scripts/setup-markets.ts
// Turns the demo "Europe / EUR" setup into XOF (West Africa) + USD (rest of world).
export default async function setupMarkets({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const pg = container.resolve(ContainerRegistrationKeys.PG_CONNECTION);
  const fulfillment = container.resolve(Modules.FULFILLMENT);
  const pricing = container.resolve(Modules.PRICING);

  const { rows: countryRows } = await pg.raw(
    "select iso_2 from region_country order by iso_2"
  );
  const allCountries: string[] = countryRows.map((r: any) => r.iso_2);
  const usdCountries = allCountries.filter((c) => !XOF_COUNTRIES.includes(c));

  logger.info("Store currencies...");
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "default_sales_channel_id"],
  });
  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: stores[0].id },
      update: {
        supported_currencies: [
          { currency_code: "xof", is_default: true },
          { currency_code: "usd", is_default: false },
        ],
      },
    },
  });

  logger.info("Warehouse...");
  const { data: locations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  });
  // Reuse the demo location so its fulfillment set and sales channel links stay valid.
  if (locations.length) {
    await updateStockLocationsWorkflow(container).run({
      input: {
        selector: { id: locations[0].id },
        update: {
          name: WAREHOUSE_NAME,
          address: { country_code: "BF", city: "", address_1: "" },
        },
      },
    });
  } else {
    logger.warn("No stock location found; run the initial migration first.");
  }

  logger.info("Removing old shipping options and tax regions...");
  const { data: options } = await query.graph({
    entity: "shipping_option",
    fields: ["id"],
  });
  if (options.length) {
    await deleteShippingOptionsWorkflow(container).run({
      input: { ids: options.map((o) => o.id) },
    });
  }
  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id"],
  });
  if (taxRegions.length) {
    await deleteTaxRegionsWorkflow(container).run({
      input: { ids: taxRegions.map((t) => t.id) },
    });
  }

  logger.info("Regions...");
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name"],
  });
  const regionService = container.resolve(Modules.REGION);
  // Reuse existing regions (re-runnable); the first demo region becomes West Africa.
  const usdExisting = regions.find((r) => r.name === "Rest of World");
  const xofExisting =
    regions.find((r) => r.name === "West Africa") ??
    regions.find((r) => r.id !== usdExisting?.id);
  const extras = regions.filter(
    (r) => r.id !== usdExisting?.id && r.id !== xofExisting?.id
  );
  if (extras.length) {
    await regionService.deleteRegions(extras.map((r) => r.id));
  }

  // Free the WAEMU countries from any other region before reassigning.
  if (usdExisting) {
    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: usdExisting.id },
        update: { countries: [] },
      },
    });
  }
  let xofRegionId: string;
  if (xofExisting) {
    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: xofExisting.id },
        update: {
          name: "West Africa",
          currency_code: "xof",
          countries: XOF_COUNTRIES,
        },
      },
    });
    xofRegionId = xofExisting.id;
  } else {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "West Africa",
            currency_code: "xof",
            countries: XOF_COUNTRIES,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    xofRegionId = result[0].id;
  }
  let usdRegionId: string;
  if (usdExisting) {
    await updateRegionsWorkflow(container).run({
      input: {
        selector: { id: usdExisting.id },
        update: { currency_code: "usd", countries: usdCountries },
      },
    });
    usdRegionId = usdExisting.id;
  } else {
    const { result } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Rest of World",
            currency_code: "usd",
            countries: usdCountries,
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    usdRegionId = result[0].id;
  }

  logger.info("Tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: allCountries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });

  logger.info("Price preferences (tax exclusive: tax is added at checkout)...");
  const existing = await pricing.listPricePreferences();
  const wanted = [
    { attribute: "currency_code", value: "xof" },
    { attribute: "currency_code", value: "usd" },
    { attribute: "region_id", value: xofRegionId },
    { attribute: "region_id", value: usdRegionId },
  ];
  const stale = existing.filter(
    (p) => !wanted.some((w) => w.attribute === p.attribute && w.value === p.value)
  );
  if (stale.length) {
    await pricing.deletePricePreferences(stale.map((p) => p.id));
  }
  for (const w of wanted) {
    const found = existing.find(
      (p) => p.attribute === w.attribute && p.value === w.value
    );
    if (found) {
      await pricing.updatePricePreferences(found.id, { is_tax_inclusive: false });
    } else {
      await pricing.createPricePreferences({ ...w, is_tax_inclusive: false });
    }
  }

  logger.info("Fulfillment zones and shipping options...");
  const sets = await fulfillment.listFulfillmentSets(
    { type: "shipping" },
    { relations: ["service_zones", "service_zones.geo_zones"] }
  );
  const zone = sets[0]?.service_zones?.[0];
  if (!zone) {
    throw new Error("No shipping service zone found; run the initial migration first.");
  }
  await fulfillment.updateServiceZones(zone.id, {
    name: "Worldwide",
    geo_zones: allCountries.map((country_code) => ({
      country_code,
      type: "country" as const,
    })),
  });
  const profiles = await fulfillment.listShippingProfiles({ type: "default" });

  const rules = [
    { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
    { attribute: "is_return", value: "false", operator: "eq" as const },
  ];
  const mk = (
    name: string,
    code: "standard" | "express",
    label: string,
    description: string
  ) => ({
    name,
    price_type: "flat" as const,
    provider_id: "manual_manual",
    service_zone_id: zone.id,
    shipping_profile_id: profiles[0].id,
    type: { label, description, code },
    prices: [
      { currency_code: "xof", amount: SHIPPING_XOF[code] },
      { currency_code: "usd", amount: SHIPPING_USD[code] },
      { region_id: xofRegionId, amount: SHIPPING_XOF[code] },
      { region_id: usdRegionId, amount: SHIPPING_USD[code] },
    ],
    rules,
  });
  await createShippingOptionsWorkflow(container).run({
    input: [
      mk("Standard Shipping", "standard", "Standard", "Ship in 2-3 days."),
      mk("Express Shipping", "express", "Express", "Ship in 24 hours."),
    ],
  });

  logger.info("Finished setting up markets (XOF + USD).");
}
