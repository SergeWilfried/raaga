import type { Metadata } from "next"
import type { Lang } from "./landing-copy"

/** Preview image for links shared on WhatsApp, LinkedIn and the like: 1200x630. */
export const SHARE_IMAGE =
  "https://images.unsplash.com/photo-1517089472343-85fc51aeb327?auto=format&fit=crop&w=1200&h=630&q=80"

export const SHARE_IMAGE_ALT =
  "Machinery working a quarry seen from above, with tracks pressed into the gravel"

/** Open Graph and Twitter fields shared by the pages that set their own title. */
export const socialMetadata = ({
  title,
  description,
  lang,
  image,
}: {
  title: string
  description: string
  lang: Lang
  image?: string | null
}): Pick<Metadata, "openGraph" | "twitter"> => {
  const images = [{ url: image || SHARE_IMAGE, alt: image ? title : SHARE_IMAGE_ALT }]
  return {
    openGraph: {
      type: "website",
      siteName: "Raaga",
      locale: lang === "fr" ? "fr_FR" : "en_US",
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: images.map((i) => i.url),
    },
  }
}

/** Language alternates for a path, using the ?lang= switch the pages honour. */
export const languageAlternates = (path: string): Metadata["alternates"] => ({
  canonical: path,
  languages: {
    en: `${path}?lang=en`,
    fr: `${path}?lang=fr`,
    "x-default": path,
  },
})

export const NOINDEX: Pick<Metadata, "robots"> = {
  robots: { index: false, follow: false },
}
