import { HttpTypes } from "@medusajs/types"
import { categoryProductCount } from "./category-count"

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
    (a, b) => categoryProductCount(b) - categoryProductCount(a)
  )

  return {
    categories: sorted.slice(0, limit),
    hasMore: sorted.length > limit,
  }
}

/**
 * The busiest categories that have no subcategories. Parents (which may be
 * groupings, not something to browse) are skipped, so a long list of children
 * can never spill into a menu that only has room for a few links.
 */
export const getLeafCategories = (
  categories: HttpTypes.StoreProductCategory[],
  limit: number
) => {
  const leaves = categories.filter(
    (category) => !category.category_children?.length
  )
  const sorted = [...leaves].sort(
    (a, b) => categoryProductCount(b) - categoryProductCount(a)
  )

  return {
    categories: sorted.slice(0, limit),
    hasMore: sorted.length > limit,
  }
}
