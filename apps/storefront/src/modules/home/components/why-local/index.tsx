import { getLandingCopy, Lang } from "@/lib/landing-copy"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Heading } from "@medusajs/ui"
import Image from "next/image"

const TILE_PHOTO =
  "https://images.unsplash.com/photo-1517089472343-85fc51aeb327?auto=format&fit=crop&w=1000&q=80"

const tileTitle =
  "font-display font-black uppercase leading-[0.95] [font-variation-settings:'wdth'_70]"

/**
 * The legs a part travels, as stops joined by a line. Both rows share one scale
 * (columns = the longest row), so fewer stops reads as a shorter journey.
 */
const Legs = ({
  label,
  stops,
  columns,
  tone,
}: {
  label: string
  stops: readonly string[]
  columns: number
  tone: "long" | "short"
}) => (
  <div className="flex flex-col gap-2">
    <p className="text-sm font-semibold text-ui-fg-base">{label}</p>
    {/* A vertical list on phones, where labels need room; a line on wider screens. */}
    <ol
      className="flex flex-col gap-1.5 small:grid small:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]"
      style={{ ["--cols" as string]: columns }}
      aria-label={`${label}: ${stops.join(", ")}`}
    >
      {stops.map((stop, index) => (
        <li
          key={stop}
          className="flex min-w-0 flex-row items-center gap-2 small:flex-col small:items-stretch small:gap-1.5"
        >
          <div className="flex items-center">
            <span
              aria-hidden="true"
              className={`h-3 w-3 shrink-0 rounded-full ${tone === "short" ? "bg-brand" : "bg-neutral-500"}`}
            />
            {index < stops.length - 1 && (
              <span
                aria-hidden="true"
                className={`hidden h-0.5 flex-1 small:block ${tone === "short" ? "bg-brand" : "bg-neutral-400"}`}
              />
            )}
          </div>
          <span className="pr-1 text-xs leading-tight text-neutral-800">{stop}</span>
        </li>
      ))}
    </ol>
  </div>
)

/**
 * Why buy from a site nearby. A bento of four tiles that differ in weight: the
 * region is the headline, the others support it. No figures: none are measured.
 */
const WhyLocal = ({ lang }: { lang: Lang }) => {
  const t = getLandingCopy(lang)
  const [region, lead, freight, cash] = t.localPoints

  return (
    <section
      id="local"
      className="content-container flex flex-col gap-6 py-14 scroll-mt-20"
      aria-labelledby="local-heading"
    >
      <Heading
        level="h2"
        id="local-heading"
        className="font-display font-extrabold uppercase text-ui-fg-base [font-variation-settings:'wdth'_75] text-[clamp(1.5rem,6.5vw,1.875rem)] small:text-4xl"
      >
        {t.localTitle}
      </Heading>

      <div className="grid grid-cols-1 gap-3 small:grid-cols-12" data-testid="why-local">
        <article className="flex flex-col gap-6 rounded-xl bg-brand p-6 text-white small:col-span-6 small:row-span-2 small:p-10">
          <h3 className={`${tileTitle} text-[clamp(2.25rem,5vw,4.5rem)]`}>{region.title}</h3>
          <div className="relative min-h-48 flex-1 overflow-hidden rounded-lg">
            <Image
              src={TILE_PHOTO}
              alt={t.heroAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover [object-position:80%_85%]"
            />
          </div>
          <p className="max-w-md text-lg leading-snug">{region.body}</p>
        </article>

        <article className="flex flex-col justify-between gap-6 rounded-xl bg-neutral-950 p-6 text-white small:col-span-6 small:p-8">
          <h3 className={`${tileTitle} text-[clamp(1.75rem,3.4vw,2.75rem)]`}>{lead.title}</h3>
          <p className="max-w-md text-base leading-relaxed text-neutral-200">{lead.body}</p>
        </article>

        <article className="flex flex-col gap-5 rounded-xl border border-neutral-300 bg-white p-6 small:col-span-6 small:p-8">
          <div className="flex flex-col gap-2">
            <h3 className={`${tileTitle} text-[clamp(1.75rem,3.4vw,2.75rem)] text-ui-fg-base`}>
              {freight.title}
            </h3>
            <p className="max-w-md text-base leading-relaxed text-neutral-800">{freight.body}</p>
          </div>
          <div className="flex flex-col gap-4" data-testid="legs">
            <Legs label={t.localLegsLabelOverseas} stops={t.localLegsOverseas} columns={t.localLegsOverseas.length} tone="long" />
            <Legs label={t.localLegsLabelLocal} stops={t.localLegsLocal} columns={t.localLegsOverseas.length} tone="short" />
            <p className="text-xs text-neutral-700">{t.localLegsCaption}</p>
          </div>
        </article>

        <article className="flex flex-col justify-between gap-6 rounded-xl border border-neutral-300 bg-white p-6 small:col-span-12 small:flex-row small:items-center small:p-8">
          <div className="flex flex-col gap-2">
            <h3 className={`${tileTitle} text-[clamp(1.75rem,3.4vw,2.75rem)] text-ui-fg-base`}>
              {cash.title}
            </h3>
            <p className="max-w-xl text-base leading-relaxed text-neutral-800">{cash.body}</p>
          </div>
          <LocalizedClientLink
            href="/suppliers"
            className="inline-flex min-h-14 w-fit shrink-0 items-center justify-center rounded-lg bg-neutral-950 px-6 py-3 text-center text-base font-semibold text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-950/40"
          >
            {t.bandSellButton}
          </LocalizedClientLink>
        </article>
      </div>
    </section>
  )
}

export default WhyLocal
