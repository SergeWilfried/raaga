import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import {
  createTaxRatesWorkflow,
  updateTaxRatesWorkflow,
} from "@medusajs/medusa/core-flows";

// Standard VAT / general consumption tax by ECOWAS member state (percent).
// Indicative headline rates: confirm against national finance laws before
// relying on them. Countries not listed here have no default rate (0%).
// Customs duty (CET/ETLS), excise and levies are not modelled.
const VAT_RATES: Record<string, { name: string; rate: number }> = {
  bj: { name: "Benin VAT", rate: 18 },
  bf: { name: "Burkina Faso VAT", rate: 18 },
  cv: { name: "Cabo Verde VAT", rate: 15 },
  ci: { name: "Côte d'Ivoire VAT", rate: 18 },
  gm: { name: "Gambia VAT", rate: 15 },
  gh: { name: "Ghana VAT", rate: 15 },
  gn: { name: "Guinea VAT", rate: 18 },
  gw: { name: "Guinea-Bissau IGV", rate: 19 },
  lr: { name: "Liberia GST", rate: 10 },
  ml: { name: "Mali VAT", rate: 18 },
  mr: { name: "Mauritania VAT", rate: 16 },
  ne: { name: "Niger VAT", rate: 19 },
  ng: { name: "Nigeria VAT", rate: 7.5 },
  sn: { name: "Senegal VAT", rate: 18 },
  sl: { name: "Sierra Leone GST", rate: 15 },
  tg: { name: "Togo VAT", rate: 18 },
};

// Usage: pnpm medusa exec ./src/scripts/setup-taxes.ts
// Re-runnable: creates the default rate per country, or updates it if it differs.
// Prices are tax-inclusive (setup-markets.ts), so these rates only split the
// tax out of the displayed price; they don't add to it.
export default async function setupTaxes({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: taxRegions } = await query.graph({
    entity: "tax_region",
    fields: ["id", "country_code", "tax_rates.id", "tax_rates.rate", "tax_rates.is_default"],
  });

  const toCreate: any[] = [];
  const toUpdate: any[] = [];
  const missing: string[] = [];

  for (const [country, { name, rate }] of Object.entries(VAT_RATES)) {
    const region = taxRegions.find((t) => t.country_code === country);
    if (!region) {
      missing.push(country);
      continue;
    }
    const current = (region.tax_rates ?? []).find((r: any) => r?.is_default);
    if (!current) {
      toCreate.push({
        tax_region_id: region.id,
        name,
        code: "vat",
        rate,
        is_default: true,
      });
    } else if (Number(current.rate) !== rate) {
      toUpdate.push({ selector: { id: current.id }, update: { name, rate } });
    }
  }

  if (toCreate.length) {
    await createTaxRatesWorkflow(container).run({ input: toCreate });
  }
  for (const u of toUpdate) {
    await updateTaxRatesWorkflow(container).run({ input: u });
  }
  logger.info(
    `Tax rates: ${toCreate.length} created, ${toUpdate.length} updated, ` +
      `${Object.keys(VAT_RATES).length - toCreate.length - toUpdate.length - missing.length} unchanged` +
      (missing.length ? `, no tax region for: ${missing.join(", ")}` : "")
  );
}
