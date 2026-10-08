import InfoPage from "@/modules/common/components/info-page"
import { resolveLang } from "@/lib/landing-copy"
import { getPageCopy } from "@/lib/pages-copy"
import { Metadata } from "next"
import { headers } from "next/headers"

type Props = { searchParams: Promise<{ lang?: string }> }

const pageLang = async (searchParams: Props["searchParams"]) =>
  resolveLang((await searchParams).lang, (await headers()).get("accept-language"))

export async function generateMetadata(props: Props): Promise<Metadata> {
  const page = getPageCopy("contact", await pageLang(props.searchParams))
  return { title: `${page.title} | Raaga`, description: page.description }
}

export default async function Page(props: Props) {
  return <InfoPage pageKey="contact" lang={await pageLang(props.searchParams)} showContact />
}
