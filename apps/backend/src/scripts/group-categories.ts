import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { readFileSync } from "fs";
import { join } from "path";

// Usage: pnpm medusa exec ./src/scripts/group-categories.ts
// Puts the flat category list under two top-level parents so the header and
// footer menus stay short: "Waghion" (the sheet's group codes) and "Nordgold"
// (the sheet's Type values). Re-runnable. Categories not in either list are
// left where they are.
export default async function groupCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productService = container.resolve(Modules.PRODUCT);

  const waghion = new Set(
    (
      JSON.parse(
        readFileSync(join(process.cwd(), "seed", "products.json"), "utf-8")
      ) as { group: string | null }[]
    )
      .map((r) => r.group)
      .filter(Boolean) as string[]
  );
  const nordgold = new Set(
    (
      JSON.parse(
        readFileSync(
          join(process.cwd(), "seed", "nordgold-ouagadougu.json"),
          "utf-8"
        )
      ) as { type: string | null }[]
    )
      .map((r) => r.type)
      .filter(Boolean) as string[]
  );

  const ensureParent = async (name: string) => {
    const [found] = await productService.listProductCategories({ name });
    if (found) return found.id;
    const created = await productService.createProductCategories({
      name,
      is_active: true,
    });
    return created.id;
  };
  const waghionId = await ensureParent("Waghion");
  const nordgoldId = await ensureParent("Nordgold");

  const categories = await productService.listProductCategories(
    {},
    { take: 500 }
  );
  let moved = 0;
  for (const c of categories) {
    if (c.id === waghionId || c.id === nordgoldId) continue;
    const parent = waghion.has(c.name)
      ? waghionId
      : nordgold.has(c.name)
        ? nordgoldId
        : null;
    if (parent && c.parent_category_id !== parent) {
      await productService.updateProductCategories(c.id, {
        parent_category_id: parent,
      });
      moved++;
    }
  }
  logger.info(`Grouped ${moved} categories under Waghion / Nordgold.`);
}
