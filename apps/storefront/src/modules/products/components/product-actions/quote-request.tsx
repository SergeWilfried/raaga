"use client"

import { requestPartQuote } from "@/lib/data/quotes"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import QuantityStepper from "../quantity-stepper"

const buttonClass =
  "flex h-11 w-full items-center justify-center rounded-lg border border-neutral-900 bg-neutral-900 px-4 text-sm font-medium text-white hover:bg-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-interactive focus-visible:ring-offset-2 disabled:opacity-60"

/**
 * The buy block for a part without a listed price. It can't go in the cart, so
 * the buyer states a quantity and requests a quote. That uses the existing
 * quote flow: the quote appears under Account > Quotes, where the merchant
 * prices it and the buyer accepts or declines. Quotes need an account, so
 * guests are sent to log in.
 */
const QuoteRequest = ({
  product,
  region,
  isLoggedIn,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  isLoggedIn: boolean
}) => {
  const [quantity, setQuantity] = useState(1)
  const [requesting, setRequesting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { countryCode } = useParams()
  const router = useRouter()

  const variant = product.variants?.[0]
  const stock = variant?.manage_inventory
    ? (variant.inventory_quantity ?? undefined)
    : undefined

  const handleRequest = async () => {
    if (!variant) return
    setRequesting(true)
    setError(null)

    try {
      const { quote } = await requestPartQuote({
        variantId: variant.id,
        quantity,
        regionId: region.id,
      })
      router.push(`/${countryCode}/account/quotes/details/${quote.id}`)
    } catch {
      setRequesting(false)
      setError("We couldn't send your quote request. Please try again.")
    }
  }

  return (
    <div className="flex flex-col gap-3 w-full" data-testid="quote-request">
      <QuantityStepper
        value={quantity}
        onChange={setQuantity}
        max={stock && stock > 0 ? stock : undefined}
        label="Quantity"
      />

      {isLoggedIn ? (
        <button
          type="button"
          className={buttonClass}
          onClick={handleRequest}
          disabled={requesting || !variant}
          data-testid="quote-cta"
        >
          {requesting ? "Sending request…" : "Request a quote"}
        </button>
      ) : (
        <LocalizedClientLink
          href="/account"
          className={buttonClass}
          data-testid="quote-cta"
        >
          Log in to request a quote
        </LocalizedClientLink>
      )}

      {error && (
        <Text className="text-sm text-ui-fg-error" role="alert">
          {error}
        </Text>
      )}
    </div>
  )
}

export default QuoteRequest
