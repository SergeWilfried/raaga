import { getLandingCopy, Lang } from "@/lib/landing-copy"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Heading } from "@medusajs/ui"
import LandingSearch from "../landing-search"
import Image from "next/image"

const BAND_PHOTO =
  "https://images.unsplash.com/photo-1711012604128-8339024a3e12?auto=format&fit=crop&w=1200&h=900&q=80"

const headingClass =
  "text-balance font-display text-[clamp(1.75rem,6vw,2.5rem)] font-black uppercase leading-none [font-variation-settings:'wdth'_72]"

/**
 * Two doors, side by side: the buyer's (search, cart, quote) and the seller's
 * (send a sheet, we list it, we arrange payment). The seller half carries the
 * photo and the brand colour because it is the newer message.
 */
const TwoSidedBand = ({ lang }: { lang: Lang }) => {
  const t = getLandingCopy(lang)

  return (
    <section
      className="grid grid-cols-1 small:grid-cols-2"
      data-testid="two-sided-band"
    >
      <div className="flex flex-col bg-neutral-100" aria-labelledby="buy-heading">
        {/* Mirrors the photo strip on the right: a bin-label plate with an
            example part number, the thing a buyer arrives holding. */}
        <div
          className="flex h-44 items-center bg-neutral-950 px-6 small:h-56 small:px-12 medium:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]"
          aria-hidden="true"
        >
          <div className="flex flex-col gap-1 rounded-md border-2 border-white/80 px-5 py-3 text-white">
            <span className="font-mono text-xs tracking-wide text-neutral-300">{t.bandPlateLabel}</span>
            <span className="font-display text-5xl font-black leading-none [font-variation-settings:'wdth'_70] small:text-6xl">
              {t.examples[0]}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-6 px-6 py-12 small:px-12 medium:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]">
          <Heading level="h2" id="buy-heading" className={`${headingClass} text-ui-fg-base`}>
            {t.bandBuyTitle}
          </Heading>
          <p className="max-w-md text-lg leading-snug text-neutral-900">{t.bandBuyBody}</p>
          <LandingSearch
            label={t.searchLabel}
            placeholder={t.searchPlaceholder}
            button={t.searchButton}
            tryLabel={t.tryLabel}
            examples={t.examples}
            tone="onLight"
            testIdPrefix="band-search"
          />
          <LocalizedClientLink
            href="/account"
            className="inline-flex min-h-11 w-fit items-center text-base font-semibold text-ui-fg-base underline underline-offset-4 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-interactive rounded-sm"
          >
            {t.bandBuyAccount}
          </LocalizedClientLink>
        </div>
      </div>

      <div className="flex flex-col bg-brand text-white" aria-labelledby="sell-heading">
        <div className="relative h-44 small:h-56">
          <Image
            src={BAND_PHOTO}
            alt={t.bandPhotoAlt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-6 px-6 py-12 small:px-12 medium:pr-[max(3rem,calc((100vw-80rem)/2+3rem))]">
          <Heading level="h2" id="sell-heading" className={`${headingClass} text-white`}>
            {t.bandSellTitle}
          </Heading>
          <ol className="flex flex-col gap-3" data-testid="sell-steps">
            {t.bandSellSteps.map((step, index) => (
              <li key={step} className="flex items-baseline gap-4 text-lg leading-snug">
                <span
                  aria-hidden="true"
                  className="font-display text-3xl font-black leading-none [font-variation-settings:'wdth'_70]"
                >
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <LocalizedClientLink
            href="/suppliers"
            className="inline-flex min-h-14 w-fit items-center justify-center rounded-lg bg-white px-6 py-3 text-center text-base font-semibold text-neutral-950 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-950/50"
          >
            {t.bandSellButton}
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default TwoSidedBand
