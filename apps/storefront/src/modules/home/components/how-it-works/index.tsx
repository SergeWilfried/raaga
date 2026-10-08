import { getLandingCopy, Lang } from "@/lib/landing-copy"
import { Heading } from "@medusajs/ui"

/** A real sequence, so the numbers carry meaning: find, order or quote, approve. */
const HowItWorks = ({ lang }: { lang: Lang }) => {
  const t = getLandingCopy(lang)

  return (
    <section id="how" className="content-container flex flex-col gap-8 py-14 scroll-mt-20" aria-labelledby="how-heading">
      <Heading
        level="h2"
        id="how-heading"
        className="font-display font-extrabold uppercase text-ui-fg-base [font-variation-settings:'wdth'_75] text-[clamp(1.5rem,6.5vw,1.875rem)] small:text-4xl"
      >
        {t.howTitle}
      </Heading>
      <ol className="grid grid-cols-1 gap-10 small:grid-cols-3 small:gap-8">
        {t.steps.map((step, index) => (
          <li key={step.title} className="flex gap-4 small:flex-col">
            <span
              aria-hidden="true"
              className="font-display text-6xl font-black leading-none text-brand [font-variation-settings:'wdth'_70] small:text-7xl"
            >
              {index + 1}
            </span>
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-semibold text-ui-fg-base">{step.title}</h3>
              <p className="max-w-sm text-base leading-relaxed text-neutral-800">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

export default HowItWorks
