"use client"

import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import ProductPrice from "../product-price"
import ProductVariantsTable from "../product-variants-table"
import QuoteRequest from "./quote-request"
import SingleVariantBuy from "./single-variant-buy"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  /** Quotes need an account; guests are sent to log in instead. */
  isLoggedIn?: boolean
}

export default function ProductActions({
  product,
  region,
  isLoggedIn = false,
}: ProductActionsProps) {
  const { cheapestPrice } = getProductPrice({ product })

  // No listed price: it can't go in the cart, so the buyer states a quantity
  // and asks for a quote instead.
  if (!cheapestPrice) {
    return (
      <div className="flex flex-col gap-4 w-full">
        <ProductPrice product={product} />
        <QuoteRequest
          product={product}
          region={region}
          isLoggedIn={isLoggedIn}
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <ProductPrice product={product} />
      {product.variants?.length === 1 ? (
        <SingleVariantBuy product={product} region={region} />
      ) : (
        <ProductVariantsTable product={product} region={region} />
      )}
    </div>
  )
}
