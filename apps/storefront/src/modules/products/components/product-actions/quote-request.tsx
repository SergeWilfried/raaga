"use client"

import { HttpTypes } from "@medusajs/types"
import { useEffect, useState } from "react"
import QuantityStepper from "../quantity-stepper"

// Set these in the storefront environment to turn on the quote buttons:
//   NEXT_PUBLIC_QUOTE_EMAIL=quotes@example.com
//   NEXT_PUBLIC_QUOTE_WHATSAPP=22670000000   (country code first, digits only)
const QUOTE_EMAIL = process.env.NEXT_PUBLIC_QUOTE_EMAIL
const QUOTE_WHATSAPP = process.env.NEXT_PUBLIC_QUOTE_WHATSAPP?.replace(/\D/g, "")

const buttonClass =
  "flex h-11 w-full items-center justify-center rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-interactive focus-visible:ring-offset-2"

/**
 * The buy block for a part without a listed price: it can't go in the cart, but
 * the buyer can still say how many they need and ask for a quote.
 */
const QuoteRequest = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const [quantity, setQuantity] = useState(1)
  // Set after mount so the server and first client render match.
  const [pageUrl, setPageUrl] = useState("")
  useEffect(() => setPageUrl(window.location.href), [])

  const partNumber = product.variants?.[0]?.sku ?? ""
  const stock = product.variants?.[0]?.manage_inventory
    ? product.variants[0].inventory_quantity ?? undefined
    : undefined

  const message =
    `Quote request\n` +
    `Part: ${product.title}\n` +
    (partNumber ? `Part number: ${partNumber}\n` : "") +
    `Quantity: ${quantity}\n` +
    (pageUrl ? `Link: ${pageUrl}\n` : "")

  const subject = `Quote request: ${partNumber || product.title}`
  const emailHref = (to: string) =>
    `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`
  const whatsappHref = QUOTE_WHATSAPP
    ? `https://wa.me/${QUOTE_WHATSAPP}?text=${encodeURIComponent(message)}`
    : undefined

  // WhatsApp first when set, then email. With neither configured the button
  // still works: it opens the buyer's mail app with the whole request filled in.
  const primaryHref = whatsappHref ?? emailHref(QUOTE_EMAIL ?? "")
  const external = Boolean(whatsappHref)

  return (
    <div className="flex flex-col gap-3 w-full" data-testid="quote-request">
      <QuantityStepper
        value={quantity}
        onChange={setQuantity}
        max={stock && stock > 0 ? stock : undefined}
        label="Quantity"
      />

      <a
        className={buttonClass}
        href={primaryHref}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        data-testid="quote-cta"
      >
        Request a quote
      </a>

      {whatsappHref && QUOTE_EMAIL && (
        <a
          className="text-center text-sm text-ui-fg-interactive underline underline-offset-2"
          href={emailHref(QUOTE_EMAIL)}
          data-testid="quote-email"
        >
          or request by email
        </a>
      )}
    </div>
  )
}

export default QuoteRequest
