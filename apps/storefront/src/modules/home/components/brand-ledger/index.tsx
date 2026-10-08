import { listBrands } from "@/lib/data/brands"
import { getLandingCopy, Lang } from "@/lib/landing-copy"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Heading } from "@medusajs/ui"

const brandHref = (brand: string) =>
  `/store?product%5BrefinementList%5D%5Bbrand%5D%5B0%5D=${encodeURIComponent(brand)}`

/**
 * Brands typeset as a ledger: name on the left, how many parts on the right.
 * No logos and no icon grid; each line is a link to that brand's parts.
 */
const BrandLedger = async ({ lang }: { lang: Lang }) => {
  const t = getLandingCopy(lang)
  const brands = await listBrands(12)

  if (!brands.length) return null

  return (
    <section className="border-t border-neutral-200 bg-neutral-50" aria-labelledby="brands-heading">
      <div className="content-container flex flex-col gap-6 py-14">
        <Heading
          level="h2"
          id="brands-heading"
          className="font-display text-3xl font-extrabold uppercase text-ui-fg-base [font-variation-settings:'wdth'_75] small:text-4xl"
        >
          {t.brandsTitle}
        </Heading>
        <ul className="grid grid-cols-1 gap-x-16 small:grid-cols-2" data-testid="brand-ledger">
          {brands.map(({ brand, count }) => (
            <li key={brand} className="border-b border-neutral-300">
              <LocalizedClientLink
                href={brandHref(brand)}
                className="group flex min-h-14 items-baseline justify-between gap-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-interactive"
              >
                <span className="font-display text-2xl font-extrabold uppercase text-ui-fg-base [font-variation-settings:'wdth'_80] group-hover:text-brand small:text-3xl">
                  {brand}
                </span>
                <span className="shrink-0 font-mono text-sm text-neutral-700">
                  {t.parts(count)}
                </span>
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default BrandLedger
