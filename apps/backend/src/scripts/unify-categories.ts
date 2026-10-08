import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { updateCategoryCounts } from "../lib/category-counts";
import {
  CATEGORIES,
  NORDGOLD_CATEGORY,
  WAGHION_CATEGORY,
} from "../lib/categories";

// Usage: pnpm medusa exec ./src/scripts/unify-categories.ts
// Replaces the per-supplier categories (Waghion codes, Nordgold types, and the
// "Waghion"/"Nordgold" parents) with the shared list in lib/categories.ts by
// re-pointing each product's category link. Re-runnable. Restart the backend
// (or reindex) afterwards so search picks up the new names.
export default async function unifyCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const pg = container.resolve(ContainerRegistrationKeys.PG_CONNECTION);
  const productService = container.resolve(Modules.PRODUCT);

  // Reuse a category whose name differs only by case (same URL handle).
  const existing = await productService.listProductCategories({}, { take: 1000 });
  const idByName = new Map<string, string>();
  const keep = new Set<string>();
  for (const name of CATEGORIES) {
    const found = existing.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (found) {
      if (found.name !== name) {
        await productService.updateProductCategories(found.id, { name });
      }
      idByName.set(name, found.id);
    } else {
      const created = await productService.createProductCategories({
        name,
        is_active: true,
      });
      idByName.set(name, created.id);
    }
    keep.add(idByName.get(name)!);
  }
  // Reused categories may still sit under a supplier parent; make them top level.
  for (const c of existing.filter((c) => keep.has(c.id) && c.parent_category_id)) {
    await productService.updateProductCategories(c.id, {
      parent_category_id: null,
    });
  }

  const mapping: Record<string, string> = {
    ...WAGHION_CATEGORY,
    ...NORDGOLD_CATEGORY,
  };
  const all = await productService.listProductCategories({}, { take: 1000 });
  const old = all.filter((c) => !keep.has(c.id));

  let moved = 0;
  const unmapped: string[] = [];
  for (const cat of old) {
    const target = mapping[cat.name];
    if (!target) {
      // Parents ("Waghion", "Nordgold") hold no products; anything else is
      // reported and left alone.
      if (!["Waghion", "Nordgold"].includes(cat.name)) unmapped.push(cat.name);
      continue;
    }
    const res = await pg.raw(
      `update product_category_product set product_category_id = ? where product_category_id = ?`,
      [idByName.get(target), cat.id] as any
    );
    moved += res.rowCount ?? 0;
  }

  const removable = old.filter(
    (c) => mapping[c.name] || ["Waghion", "Nordgold"].includes(c.name)
  );
  // Children first so parents can be deleted.
  for (const c of removable.filter((c) => c.parent_category_id)) {
    await productService.deleteProductCategories([c.id]);
  }
  for (const c of removable.filter((c) => !c.parent_category_id)) {
    await productService.deleteProductCategories([c.id]);
  }

  await updateCategoryCounts(container);
  logger.info(
    `Moved ${moved} product links; removed ${removable.length} old categories.` +
      (unmapped.length ? ` Left alone (no mapping): ${unmapped.join(", ")}` : "")
  );
}
