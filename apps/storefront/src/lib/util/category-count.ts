import { HttpTypes } from "@medusajs/types"

/**
 * A category's published product count, kept in `metadata.product_count` by
 * the backend (update-category-counts.ts) so menus don't have to load every
 * product of every category.
 */
export const categoryProductCount = (
  category: Pick<HttpTypes.StoreProductCategory, "metadata">
): number => Number(category.metadata?.product_count ?? 0)
