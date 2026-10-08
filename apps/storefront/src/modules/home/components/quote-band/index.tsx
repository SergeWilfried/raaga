import { getLandingCopy, Lang } from "@/lib/landing-copy"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Heading } from "@medusajs/ui"

/** The closing call to action: parts without a price go through a quote. */
const QuoteBand = ({ lang }: { lang: Lang }) => {
  const t = getLandingCopy(lang)

  return (
    <section className="bg-brand" aria-labelledby="quote-heading">
      <div className="content-container flex flex-col items-start gap-6 py-14 small:flex-row small:items-center small:justify-between">
        <div className="flex max-w-2xl flex-col gap-3">
          <Heading
            level="h2"
            id="quote-heading"
            className="font-display text-3xl font-black uppercase leading-none text-white [font-variation-settings:'wdth'_72] small:text-5xl"
          >
            {t.quoteTitle}
          </Heading>
          <p className="text-lg leading-snug text-white">{t.quoteBody}</p>
        </div>
        <LocalizedClientLink
          href="/account"
          className="inline-flex h-14 shrink-0 items-center justify-center rounded-lg bg-white px-6 text-base font-semibold text-neutral-950 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-950/50"
        >
          {t.quoteButton}
        </LocalizedClientLink>
      </div>
    </section>
  )
}

export default QuoteBand
