import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@medusajs/ui"
import Product from "../product-preview"
import Scroller from "./scroller"

// Enough to compare across two sideways-scrolling rows.
const RELATED_LIMIT = 16

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  // Related = same category (our parts carry no tags or collections), with
  // the same brand first. Without a category there's nothing meaningful to
  // show, so the section is left out rather than listing arbitrary items.
  const categoryIds = (product.categories ?? [])
    .map((category) => category.id)
    .filter(Boolean)

  if (!categoryIds.length) {
    return null
  }

  const queryParams: HttpTypes.FindParams & HttpTypes.StoreProductParams & {
    category_id?: string[]
    is_giftcard?: boolean
  } = {
    region_id: region.id,
    category_id: categoryIds,
    is_giftcard: false,
    limit: RELATED_LIMIT + 1,
  }

  const brand = product.metadata?.brand

  const products = await listProducts({
    queryParams,
    countryCode,
  }).then(({ response }) =>
    response.products
      .filter((responseProduct) => responseProduct.id !== product.id)
      .sort((a, b) =>
        brand
          ? Number(b.metadata?.brand === brand) -
            Number(a.metadata?.brand === brand)
          : 0
      )
      .slice(0, RELATED_LIMIT)
  )

  if (!products.length) {
    return null
  }

  // Two rows that scroll on their own. Parts alternate between them, so the
  // best matches (same brand first) lead both rows rather than filling one.
  const rows =
    products.length > 3
      ? [
          products.filter((_, i) => i % 2 === 0),
          products.filter((_, i) => i % 2 === 1),
        ]
      : [products]

  return (
    <section className="flex flex-col gap-4" aria-labelledby="related-parts-heading">
      <Heading level="h2" id="related-parts-heading" className="text-lg text-ui-fg-base">
        Other customers also viewed
      </Heading>
      <div className="flex flex-col gap-3">
        {rows.map((row, index) => (
          <Scroller
            key={index}
            label={`Similar parts, row ${index + 1} of ${rows.length}`}
          >
            <ul className="flex w-max gap-3" data-testid="related-row">
              {row.map((product) => (
                <li key={product.id} className="w-[16.5rem] shrink-0 snap-start">
                  <Product region={region} product={product} variant="card" />
                </li>
              ))}
            </ul>
          </Scroller>
        ))}
      </div>
    </section>
  )
}
