import { getLandingCopy, Lang } from "@/lib/landing-copy"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Heading } from "@medusajs/ui"

/** The closing call to action: parts without a price go through a quote. */
const QuoteBand = ({ lang }: { lang: Lang }) => {
  const t = getLandingCopy(lang)

  return (
    <section className="bg-brand" aria-labelledby="quote-heading">
      <div className="content-container flex flex-col gap-6 py-14">
        {/* Its own full-width row, so the line never has to share space with the
            button and break. On a phone it may wrap, balanced. */}
        <Heading
          level="h2"
          id="quote-heading"
          className="text-balance font-display text-[clamp(1.5rem,7vw,1.875rem)] font-black uppercase leading-none text-white [font-variation-settings:'wdth'_72] small:whitespace-nowrap small:text-[clamp(2rem,4.4vw,4rem)]"
        >
          {t.quoteTitle}
        </Heading>
        <div className="flex flex-col gap-6 small:flex-row small:items-center small:justify-between">
          <p className="max-w-2xl text-lg leading-snug text-white">{t.quoteBody}</p>
          <LocalizedClientLink
            href="/account"
            className="inline-flex min-h-14 shrink-0 items-center justify-center rounded-lg bg-white px-6 py-3 text-center text-base font-semibold text-neutral-950 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-950/50"
          >
            {t.quoteButton}
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}

export default QuoteBand
