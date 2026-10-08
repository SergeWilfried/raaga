import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateCategoryCounts } from "../lib/category-counts";

// Usage: pnpm medusa exec ./src/scripts/update-category-counts.ts
export default async function run({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const { categories, updated } = await updateCategoryCounts(container);
  logger.info(`Category counts: ${updated} updated of ${categories}.`);
}
