import { hasContact } from "@/lib/contact"
import { listBrands } from "@/lib/data/brands"
import { listCategories } from "@/lib/data/categories"
import { getLandingCopy, resolveLang } from "@/lib/landing-copy"
import { getLeafCategories } from "@/lib/util/top-categories"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import SocialLinks from "@/modules/layout/components/social-links"
import { headers } from "next/headers"
import { ReactNode } from "react"

const MAX_CATEGORIES = 4
const MAX_BRANDS = 5

const linkClass =
  "inline-block py-2 text-neutral-300 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"

const Column = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-sm font-semibold text-white">{title}</h2>
    <ul className="flex flex-col text-sm">{children}</ul>
  </div>
)

/**
 * A short footer: who we are, the busiest categories and brands, and account
 * links. Every list is capped; the full lists live on the parts page.
 */
export default async function Footer() {
  const t = getLandingCopy(
    resolveLang(undefined, (await headers()).get("accept-language"))
  )

  const [allCategories, brands] = await Promise.all([
    listCategories().catch(() => []),
    listBrands(MAX_BRANDS),
  ])
  const { categories, hasMore } = getLeafCategories(allCategories, MAX_CATEGORIES)
  // Contact and supplier pages only make sense once a way to reach us is set.
  const canContact = hasContact()

  return (
    <footer className="w-full bg-neutral-950 text-neutral-300">
      <div className="content-container grid grid-cols-2 gap-x-6 gap-y-10 py-14 small:grid-cols-[minmax(17rem,1.7fr)_repeat(5,minmax(0,1fr))] small:gap-x-8">
        <div className="col-span-2 flex flex-col gap-3 small:col-span-1">
          <LocalizedClientLink
            href="/"
            className="w-fit font-display text-4xl font-black uppercase leading-none text-white [font-variation-settings:'wdth'_70] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
          >
            Raaga
          </LocalizedClientLink>
          <p className="max-w-md text-sm leading-relaxed">{t.footerTagline}</p>
          <SocialLinks label={t.footerFollow} />
        </div>


        {brands.length > 0 && (
          <Column title={t.footerBrands}>
            {brands.map(({ brand }) => (
              <li key={brand}>
                <LocalizedClientLink
                  href={`/store?product%5BrefinementList%5D%5Bbrand%5D%5B0%5D=${encodeURIComponent(brand)}`}
                  className={linkClass}
                >
                  {brand}
                </LocalizedClientLink>
              </li>
            ))}
          </Column>
        )}

        <Column title={t.footerCompany}>
          <li>
            <LocalizedClientLink href="/about" className={linkClass}>
              {t.footerAbout}
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/store" className={linkClass}>
              {t.footerAllParts}
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/#brands" className={linkClass}>
              {t.footerBrandsLink}
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/#how" className={linkClass}>
              {t.footerHow}
            </LocalizedClientLink>
          </li>
        </Column>

        <Column title={t.footerSupport}>
          <li>
            <LocalizedClientLink href="/account/quotes" className={linkClass}>
              {t.footerQuotes}
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/account/orders" className={linkClass}>
              {t.footerOrders}
            </LocalizedClientLink>
          </li>
          {canContact && (
            <li>
              <LocalizedClientLink href="/contact" className={linkClass}>
                {t.footerContact}
              </LocalizedClientLink>
            </li>
          )}
        </Column>

        <Column title={t.footerMore}>
          <li>
            <LocalizedClientLink href="/terms" className={linkClass}>
              {t.footerTerms}
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/privacy" className={linkClass}>
              {t.footerPrivacy}
            </LocalizedClientLink>
          </li>
          {canContact && (
            <li>
              <LocalizedClientLink href="/suppliers" className={linkClass}>
                {t.footerSuppliers}
              </LocalizedClientLink>
            </li>
          )}
        </Column>
      </div>

      <div className="border-t border-neutral-800">
        <p className="content-container py-5 text-xs text-neutral-400">
          © {new Date().getFullYear()} Raaga. {t.footerRights}
        </p>
      </div>
    </footer>
  )
}
