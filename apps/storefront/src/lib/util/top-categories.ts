import { HttpTypes } from "@medusajs/types"

/**
 * The top-level categories with the most products, for menus that can't list
 * everything. The full list stays on the store page, behind a "See more" link.
 */
export const getTopCategories = (
  categories: HttpTypes.StoreProductCategory[],
  limit: number
) => {
  const topLevel = categories.filter((category) => !category.parent_category_id)

  const sorted = [...topLevel].sort(
    (a, b) => (b.products?.length ?? 0) - (a.products?.length ?? 0)
  )

  return {
    categories: sorted.slice(0, limit),
    hasMore: sorted.length > limit,
  }
}
