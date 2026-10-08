import { listProducts } from "@/lib/data/products"
import { getRegion } from "@/lib/data/regions"
import { getLandingCopy, Lang } from "@/lib/landing-copy"
import { getProductPrice } from "@/lib/util/get-product-price"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import ProductPreview from "@/modules/products/components/product-preview"
import Scroller from "@/modules/products/components/related-products/scroller"
import { Heading } from "@medusajs/ui"

/**
 * Real parts, in stock, with real prices: the page's proof. Priced parts come
 * first; if the catalogue can't be reached the whole section is left out.
 */
const ShelfNow = async ({
  countryCode,
  lang,
}: {
  countryCode: string
  lang: Lang
}) => {
  const t = getLandingCopy(lang)

  const region = await getRegion(countryCode).catch(() => null)
  if (!region) return null

  const products = await listProducts({
    queryParams: { limit: 40 },
    countryCode,
  })
    .then(({ response }) => response.products)
    .catch(() => [])

  const inStock = products.filter((product) =>
    (product.variants ?? []).some((variant) => (variant.inventory_quantity ?? 0) > 0)
  )
  const priced = inStock.filter((product) => getProductPrice({ product }).cheapestPrice)
  const shelf = [...priced, ...inStock.filter((p) => !priced.includes(p))].slice(0, 12)

  if (!shelf.length) return null

  return (
    <section className="content-container flex flex-col gap-5 py-14" aria-labelledby="shelf-heading">
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <Heading
          level="h2"
          id="shelf-heading"
          className="font-display text-3xl font-extrabold uppercase text-ui-fg-base [font-variation-settings:'wdth'_75] small:text-4xl"
        >
          {t.shelfTitle}
        </Heading>
        <LocalizedClientLink
          href="/store"
          className="shrink-0 text-sm font-medium text-ui-fg-base underline underline-offset-4 hover:text-brand"
        >
          {t.shelfAll}
        </LocalizedClientLink>
      </div>

      <Scroller label={t.shelfScroll}>
        <ul className="flex w-max gap-3">
          {shelf.map((product) => (
            <li key={product.id} className="w-[16.5rem] shrink-0 snap-start">
              <ProductPreview product={product} region={region} variant="card" />
            </li>
          ))}
        </ul>
      </Scroller>
    </section>
  )
}

export default ShelfNow
