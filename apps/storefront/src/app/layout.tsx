import { getBaseURL } from "@/lib/util/env"
import { Toaster } from "@medusajs/ui"
import { Analytics } from "@vercel/analytics/next"
import { GeistSans } from "geist/font/sans"
import { Archivo } from "next/font/google"
import { Metadata } from "next"
import "@/styles/globals.css"

// Display face for the landing page: a variable family with a width axis, used
// condensed and heavy like crate stencils and bin labels.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  applicationName: "Raaga",
  title: "Raaga | Spare Parts from Mines & Plants in West Africa",
  description:
    "Buy and sell surplus spare parts held at mines and plants across West Africa. Search by part number, brand or machine: closer than an overseas order.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    siteName: "Raaga",
    title: "Raaga | Spare Parts from Mines & Plants in West Africa",
    description:
      "Buy and sell surplus spare parts held at mines and plants across West Africa. Search by part number, brand or machine: closer than an overseas order.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1517089472343-85fc51aeb327?auto=format&fit=crop&w=1200&h=630&q=80",
        alt: "Machinery working a quarry seen from above, with tracks pressed into the gravel",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={`${GeistSans.variable} ${archivo.variable}`}>
      <body>
        <main className="relative">{props.children}</main>
        <Toaster className="z-[99999]" position="bottom-left" />
        <Analytics />
      </body>
    </html>
  )
}
