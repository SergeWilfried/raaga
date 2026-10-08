import { sdk } from "@/lib/config"
import { getAuthHeaders } from "@/lib/data/cookies"
import { getProductByHandle } from "@/lib/data/products"
import { getRegion, listRegions } from "@/lib/data/regions"
import ProductTemplate from "@/modules/products/templates"
import { getProductPrice } from "@/lib/util/get-product-price"
import { resolveLang } from "@/lib/landing-copy"
import { languageAlternates, socialMetadata } from "@/lib/seo"
import { Metadata } from "next"
import { headers } from "next/headers"
import { notFound } from "next/navigation"

export const dynamicParams = true

const DEFAULT_COUNTRY = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"
const PRERENDER_PRODUCTS = 50

type Props = {
  params: { countryCode: string; handle: string }
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    // Pre-render only the default country; other countries and the rest of
    // the catalog render on demand (dynamicParams) so builds stay fast.
    const prerenderCountries = countryCodes.filter(
      (c) => c === DEFAULT_COUNTRY
    )

    const { products } = await sdk.store.product.list(
      { fields: "handle", limit: PRERENDER_PRODUCTS },
      { next: { tags: ["products"] }, ...(await getAuthHeaders()) }
    )

    return prerenderCountries
      .map((countryCode) =>
        products.map((product) => ({
          countryCode,
          handle: product.handle,
        }))
      )
      .flat()
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await getProductByHandle(handle, region.id)

  if (!product) {
    notFound()
  }

  const lang = resolveLang(undefined, (await headers()).get("accept-language"))
  const brand =
    typeof product.metadata?.brand === "string" ? product.metadata.brand.trim() : ""
  const sku = product.variants?.[0]?.sku
  const price = getProductPrice({ product }).cheapestPrice?.calculated_price

  const title = `${product.title}${sku ? ` (${sku})` : ""} | Raaga`
  const facts = [
    `${brand ? `${brand} ` : ""}${product.title}`,
    sku ? (lang === "fr" ? `référence ${sku}` : `part number ${sku}`) : null,
    price
      ? lang === "fr"
        ? `${price} HT`
        : `${price} excl. VAT`
      : lang === "fr"
        ? "prix sur demande"
        : "price on request",
  ]
    .filter(Boolean)
    .join(", ")
  const tail =
    lang === "fr"
      ? ". Pièce détachée en Afrique de l'Ouest : stock en direct, commande ou devis."
      : ". Spare part in West Africa: live stock, order or quote."
  // Keep the closing sentence whole; trim the facts if the whole is too long.
  const room = 158 - tail.length
  const description =
    facts.length > room ? `${facts.slice(0, Math.max(0, room - 1)).trimEnd()}…${tail}` : `${facts}${tail}`

  return {
    title,
    description,
    alternates: languageAlternates(
      `/${params.countryCode}/products/${product.handle}`
    ),
    ...socialMetadata({
      title,
      description,
      lang,
      image: product.thumbnail ?? product.images?.[0]?.url,
    }),
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const pricedProduct = await getProductByHandle(params.handle, region.id)
  if (!pricedProduct) {
    notFound()
  }

  return (
    <ProductTemplate
      product={pricedProduct}
      region={region}
      countryCode={params.countryCode}
    />
  )
}
