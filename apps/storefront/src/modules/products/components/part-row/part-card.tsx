import { brandLabel } from "@/lib/util/brand"
import Thumbnail from "@/modules/products/components/thumbnail"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { Text } from "@medusajs/ui"
import { ReactNode } from "react"

type PartCardProps = {
  href: string
  title: string
  brand?: string | null
  partNumber?: string | null
  thumbnail?: string | null
  images?: { url?: string | null }[] | null
  price: ReactNode
  stock?: ReactNode
  action?: ReactNode
}

/**
 * A compact part for sideways-scrolling grids: picture, brand, name, part
 * number, price. The title link stretches over the card; the action sits above
 * it so it never nests inside the link.
 */
const PartCard = ({
  href,
  title,
  brand,
  partNumber,
  thumbnail,
  images,
  price,
  stock,
  action,
}: PartCardProps) => (
  <div
    data-testid="product-wrapper"
    className="relative flex h-full flex-col gap-3 rounded-lg border border-neutral-200 bg-white p-3 hover:border-neutral-400"
  >
    <div className="flex items-start gap-3 min-w-0">
      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-neutral-200 bg-neutral-100">
        <Thumbnail
          thumbnail={thumbnail}
          images={images}
          size="square"
          type="preview"
          data-testid="product-thumbnail"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <Text className="text-xs font-medium text-neutral-700" data-testid="product-brand">
          {brandLabel(brand)}
        </Text>
        <LocalizedClientLink
          href={href}
          className="line-clamp-2 break-words text-sm font-medium text-ui-fg-base after:absolute after:inset-0 focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ui-fg-interactive"
          data-testid="product-title"
        >
          {title}
        </LocalizedClientLink>
      </div>
    </div>

    {partNumber && (
      <Text className="font-mono text-xs text-neutral-700 break-all" data-testid="part-number">
        Part no. {partNumber}
      </Text>
    )}

    <div className="mt-auto flex items-end justify-between gap-2">
      <div className="flex min-w-0 flex-col">
        {price}
        {stock && <div className="mt-1 text-xs text-neutral-700">{stock}</div>}
      </div>
      {action && <div className="relative z-10 shrink-0">{action}</div>}
    </div>
  </div>
)

export default PartCard
