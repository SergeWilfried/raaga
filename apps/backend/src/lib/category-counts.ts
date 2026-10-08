import type { MedusaContainer } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

/**
 * Stores each category's published product count in `metadata.product_count`.
 *
 * The storefront shows these counts in menus and filters. Reading them from
 * metadata keeps those requests tiny; loading every category's full product
 * list on each page grows with the catalog (5.8 MB at ~3,200 products).
 * Re-run after any product load (the seed scripts do).
 */
export async function updateCategoryCounts(container: MedusaContainer) {
  const pg = container.resolve(ContainerRegistrationKeys.PG_CONNECTION);
  const productService = container.resolve(Modules.PRODUCT);

  const { rows } = await pg.raw(`
    select pcp.product_category_id as id, count(*)::int as n
    from product_category_product pcp
    join product p on p.id = pcp.product_id and p.deleted_at is null and p.status = 'published'
    group by 1
  `);
  const counts = new Map<string, number>(rows.map((r: any) => [r.id, r.n]));

  const categories = await productService.listProductCategories(
    {},
    { take: 1000, select: ["id", "metadata"] }
  );
  let updated = 0;
  for (const c of categories) {
    const n = counts.get(c.id) ?? 0;
    if ((c.metadata as any)?.product_count === n) continue;
    await productService.updateProductCategories(c.id, {
      metadata: { ...(c.metadata ?? {}), product_count: n },
    });
    updated++;
  }
  return { categories: categories.length, updated };
}
