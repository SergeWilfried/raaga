import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { updateProductVariantsWorkflow } from "@medusajs/medusa/core-flows";
import { readFileSync } from "fs";
import { join } from "path";
import { waghionPrices } from "../lib/waghion-pricing";

// Usage: pnpm medusa exec ./src/scripts/update-waghion-prices.ts
// Re-prices the existing Waghion items (pre-tax XOF + USD) without touching other
// products, and switches the price preferences to tax-exclusive so checkout adds
// the tax on top.
export default async function updateWaghionPrices({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const pricing = container.resolve(Modules.PRICING);

  const rows: { code: string; dup: number; unit_price_xof: number }[] =
    JSON.parse(
      readFileSync(join(process.cwd(), "seed", "products.json"), "utf-8")
    );
  const priceBySku = new Map(
    rows.map((r) => [
      `${r.code}${r.dup > 1 ? `-${r.dup}` : ""}`,
      waghionPrices(r.unit_price_xof),
    ])
  );

  const { data: variants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "sku"],
    filters: { sku: [...priceBySku.keys()] },
  });
  logger.info(`Re-pricing ${variants.length} Waghion variants...`);

  const BATCH = 50;
  for (let i = 0; i < variants.length; i += BATCH) {
    await updateProductVariantsWorkflow(container).run({
      input: {
        product_variants: variants.slice(i, i + BATCH).map((v) => {
          const p = priceBySku.get(v.sku!)!;
          return {
            id: v.id,
            prices: [
              { amount: p.xof, currency_code: "xof" },
              { amount: p.usd, currency_code: "usd" },
            ],
          };
        }),
      },
    });
    logger.info(`  ${Math.min(i + BATCH, variants.length)}/${variants.length}`);
  }

  const prefs = await pricing.listPricePreferences();
  for (const pref of prefs) {
    await pricing.updatePricePreferences(pref.id, { is_tax_inclusive: false });
  }
  logger.info(`Price preferences set to tax-exclusive (${prefs.length}).`);
}
