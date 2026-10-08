import { sdk } from "@/lib/config"

export type BrandCount = { brand: string; count: number }

/** Brands with their published part counts, busiest first. Empty on any failure. */
export const listBrands = async (limit = 12): Promise<BrandCount[]> => {
  try {
    const { brands } = await sdk.client.fetch<{ brands: BrandCount[] }>(
      "/store/brands",
      { next: { revalidate: 300, tags: ["brands"] } }
    )
    return brands.slice(0, limit)
  } catch {
    return []
  }
}
