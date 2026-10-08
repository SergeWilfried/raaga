import { getRegion } from "@/lib/data/regions"
import SearchStoreTemplate from "@/modules/store/templates/search-store"
import { getLandingCopy, resolveLang } from "@/lib/landing-copy"
import { languageAlternates, socialMetadata } from "@/lib/seo"
import { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

export const dynamicParams = true

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ lang?: string }>
}): Promise<Metadata> {
  const { countryCode } = await props.params
  const lang = resolveLang(
    (await props.searchParams).lang,
    (await headers()).get("accept-language")
  )
  const t = getLandingCopy(lang)
  return {
    title: t.storeTitle,
    description: t.storeDescription,
    alternates: languageAlternates(`/${countryCode}/store`),
    ...socialMetadata({ title: t.storeTitle, description: t.storeDescription, lang }),
  }
}

export default async function StorePage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ lang?: string }>
}) {
  const { countryCode } = await props.params
  const lang = resolveLang(
    (await props.searchParams).lang,
    (await headers()).get("accept-language")
  )
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  return (
    <SearchStoreTemplate
      currencyCode={region.currency_code}
      heading={getLandingCopy(lang).storeHeading}
    />
  )
}
