import BrandLedger from "@/modules/home/components/brand-ledger"
import Hero from "@/modules/home/components/hero"
import HowItWorks from "@/modules/home/components/how-it-works"
import TwoSidedBand from "@/modules/home/components/two-sided-band"
import WhyLocal from "@/modules/home/components/why-local"
import ShelfNow from "@/modules/home/components/shelf-now"
import { getLandingCopy, resolveLang } from "@/lib/landing-copy"
import { languageAlternates, socialMetadata } from "@/lib/seo"
import { Metadata } from "next"
import { headers } from "next/headers"
import { Suspense } from "react"

type Props = {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ lang?: string }>
}

const pageLang = async (searchParams: Props["searchParams"]) => {
  const { lang } = await searchParams
  return resolveLang(lang, (await headers()).get("accept-language"))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const lang = await pageLang(props.searchParams)
  const t = getLandingCopy(lang)
  const { countryCode } = await props.params
  return {
    title: t.metaTitle,
    description: t.metaDescription,
    alternates: languageAlternates(`/${countryCode}`),
    ...socialMetadata({ title: t.metaTitle, description: t.metaDescription, lang }),
  }
}

export default async function Home(props: Props) {
  const { countryCode } = await props.params
  const lang = await pageLang(props.searchParams)

  return (
    <div className="flex flex-col">
      <Hero lang={lang} />
      <Suspense fallback={<div className="content-container h-72 py-14" aria-hidden="true" />}>
        <ShelfNow countryCode={countryCode} lang={lang} />
      </Suspense>
      <WhyLocal lang={lang} />
      <Suspense fallback={null}>
        <BrandLedger lang={lang} />
      </Suspense>
      <HowItWorks lang={lang} />
      <TwoSidedBand lang={lang} />
    </div>
  )
}
