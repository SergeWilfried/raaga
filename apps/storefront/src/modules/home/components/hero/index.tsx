import Image from "next/image"
import LandingSearch from "../landing-search"
import { getLandingCopy, Lang } from "@/lib/landing-copy"

const HERO_PHOTO =
  "https://images.unsplash.com/photo-1517089472343-85fc51aeb327?auto=format&fit=crop&w=1600&q=80"

/**
 * One idea per screen: find a part. A brand-coloured block holds the headline
 * and the search; one photo of machinery at work fills the other side.
 */
const Hero = ({ lang }: { lang: Lang }) => {
  const t = getLandingCopy(lang)

  // French runs about 20% longer; a narrower cut at a smaller size keeps each
  // half of the headline on one line, as in English.
  const headlineSize =
    lang === "fr"
      ? "text-[clamp(2.1rem,6vw,4.75rem)] [font-variation-settings:'wdth'_62]"
      : "text-[clamp(2.4rem,7.5vw,6rem)] [font-variation-settings:'wdth'_70]"

  return (
    <section
      className="grid w-full grid-cols-1 bg-brand small:min-h-[min(44rem,calc(100svh-4rem))] small:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]"
      data-testid="landing-hero"
    >
      <div className="relative order-2 flex flex-col justify-center gap-8 px-6 py-12 small:order-1 small:px-12 small:py-16 medium:pl-[max(3rem,calc((100vw-80rem)/2+3rem))]">
        <h1 className={`font-display ${headlineSize} font-black uppercase leading-[0.92] tracking-[-0.01em] text-white`}>
          <span className="block whitespace-nowrap landing-rise">{t.heroLine1}</span>
          <span className="block whitespace-nowrap landing-rise landing-rise-2">{t.heroLine2}</span>
        </h1>
        <p className="max-w-md text-lg leading-snug text-white landing-rise landing-rise-3">
          {t.heroSub}
        </p>
        <div className="landing-rise landing-rise-3">
          <LandingSearch
            label={t.searchLabel}
            placeholder={t.searchPlaceholder}
            button={t.searchButton}
            tryLabel={t.tryLabel}
            examples={t.examples}
          />
        </div>
      </div>

      <div className="relative order-1 h-56 bg-neutral-800 small:order-2 small:h-auto">
        <Image
          src={HERO_PHOTO}
          alt={t.heroAlt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-cover"
        />
      </div>
    </section>
  )
}

export default Hero
