import { brandLabel } from "@/lib/util/brand"
import Thumbnail from "@/modules/products/components/thumbnail"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Text } from "@medusajs/ui"
import { ReactNode } from "react"

type PartRowProps = {
  href: string
  title: string
  brand?: string | null
  partNumber?: string | null
  thumbnail?: string | null
  images?: { url?: string | null }[] | null
  /** Price, or "Price on request". */
  price: ReactNode
  stock?: ReactNode
  /** Add-to-cart control. Sits above the row link, never inside it. */
  action?: ReactNode
}

/**
 * One part in a list: brand, name, part number, price, stock. The whole row
 * opens the part (the title link stretches over it); the action sits above
 * that link so it never nests inside it.
 */
const PartRow = ({
  href,
  title,
  brand,
  partNumber,
  thumbnail,
  images,
  price,
  stock,
  action,
}: PartRowProps) => (
  <div
    data-testid="product-wrapper"
    className="relative flex flex-col gap-2 px-4 py-3 bg-white hover:bg-neutral-50 border-b border-neutral-200 last:border-b-0 small:flex-row small:items-center small:gap-6"
  >
    <div className="flex items-start gap-3 min-w-0 small:flex-1">
      {/* The picture, or a placeholder until the part has one. */}
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
        <Thumbnail
          thumbnail={thumbnail}
          images={images}
          size="square"
          type="preview"
          data-testid="product-thumbnail"
        />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
      <Text className="text-xs font-medium text-neutral-700" data-testid="product-brand">
        {brandLabel(brand)}
      </Text>
      <LocalizedClientLink
        href={href}
        className="font-medium text-ui-fg-base line-clamp-2 break-words after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-ui-fg-interactive"
        data-testid="product-title"
      >
        {title}
      </LocalizedClientLink>
      {partNumber && (
        <Text className="text-xs text-neutral-700 font-mono break-all" data-testid="part-number">
          Part no. {partNumber}
        </Text>
      )}
      </div>
    </div>

    <div className="flex items-center justify-between gap-4 small:justify-end small:shrink-0">
      {stock && <div className="text-xs text-neutral-700 small:w-24">{stock}</div>}
      <div className="flex flex-col small:items-end small:w-36">{price}</div>
      {action && <div className="relative z-10 shrink-0">{action}</div>}
    </div>
  </div>
)

export default PartRow
