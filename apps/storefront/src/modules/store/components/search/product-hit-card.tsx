"use client"

import { convertToLocale } from "@/lib/util/money"
import {
  hitPricing,
  type ProductHit,
} from "@/modules/layout/components/search/hit"
import PartRow from "@/modules/products/components/part-row"
import { Text, clx } from "@medusajs/ui"

const ProductHitCard = ({
  hit,
  currencyCode,
}: {
  hit: ProductHit
  currencyCode: string
}) => {
  // Without a handle there's no product page to link to.
  if (!hit.handle || !hit.title) {
    return null
  }

  const pricing = hitPricing(hit, currencyCode)
  const format = (value: number) =>
    convertToLocale({ amount: value, currency_code: pricing.currency_code })

  const max = pricing.max_price ?? pricing.min_price
  const isRange = pricing.min_price !== null && (max ?? 0) > pricing.min_price

  const price =
    pricing.min_price === null ? (
      <Text className="text-ui-fg-base font-medium" data-testid="price-on-request">
        Price on request
      </Text>
    ) : (
      <>
        {/* A range already spans the discount, so the struck-through original
            would describe only the cheapest variant. */}
        {!isRange && pricing.on_sale && (
          <Text className="line-through text-neutral-700 text-xs">
            {format(pricing.original_price!)}
          </Text>
        )}
        <Text
          className={clx("text-neutral-950 font-medium", {
            "text-ui-fg-interactive": pricing.on_sale,
          })}
        >
          {isRange
            ? `${format(pricing.min_price)} - ${format(max!)}`
            : format(pricing.min_price)}
        </Text>
        {!isRange && pricing.on_sale && (
          <Text className="text-xs text-ui-fg-interactive">
            -{pricing.discount_percentage}%
          </Text>
        )}
        <Text className="text-neutral-700 text-xs">Excl. VAT</Text>
      </>
    )

  return (
    <PartRow
      href={`/products/${hit.handle}`}
      title={hit.title}
      brand={hit.brand}
      partNumber={hit.part_number}
      thumbnail={hit.thumbnail}
      price={price}
    />
  )
}

export default ProductHitCard
