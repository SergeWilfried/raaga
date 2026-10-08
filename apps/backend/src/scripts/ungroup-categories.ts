import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

// Usage: pnpm medusa exec ./src/scripts/ungroup-categories.ts
// Undoes group-categories.ts: moves the children of the "Waghion" and "Nordgold"
// parents back to the top level and deletes those parents. Customers should
// never see client names in the category menus.
export default async function ungroupCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const productService = container.resolve(Modules.PRODUCT);

  const parents = await productService.listProductCategories({
    name: ["Waghion", "Nordgold"],
  });
  let moved = 0;
  for (const parent of parents) {
    const children = await productService.listProductCategories(
      { parent_category_id: parent.id },
      { take: 500 }
    );
    for (const child of children) {
      await productService.updateProductCategories(child.id, {
        parent_category_id: null,
      });
      moved++;
    }
    await productService.deleteProductCategories([parent.id]);
  }
  logger.info(`Ungrouped ${moved} categories; removed ${parents.length} parents.`);
}
