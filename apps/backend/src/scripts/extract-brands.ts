import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";
import { extractBrand } from "../lib/brands";

// Usage: pnpm medusa exec ./src/scripts/extract-brands.ts
// Sets metadata.brand from the item name where a known brand appears in it.
// Re-runnable; leaves a product alone when it already has a brand.
export default async function extractBrands({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "metadata"],
  });

  const updates = products
    .map((p) => {
      const existing = (p.metadata ?? {}) as Record<string, unknown>;
      if (existing.brand) return null;
      const brand = extractBrand(p.title);
      return brand
        ? { id: p.id, metadata: { ...existing, brand } }
        : null;
    })
    .filter((u): u is NonNullable<typeof u> => u !== null);

  logger.info(`Brand found in ${updates.length} of ${products.length} products`);
  const BATCH = 50;
  for (let i = 0; i < updates.length; i += BATCH) {
    await updateProductsWorkflow(container).run({
      input: { products: updates.slice(i, i + BATCH) },
    });
  }
  logger.info("Finished extracting brands.");
}
