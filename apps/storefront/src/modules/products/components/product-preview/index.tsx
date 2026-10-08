import { brandLabel } from "@/lib/util/brand"
import { getProductPrice } from "@/lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewAddToCart from "./preview-add-to-cart"
import PreviewPrice from "./price"
import PartRow from "../part-row"
import PartCard from "../part-row/part-card"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  variant = "row",
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
  /** "row" for lists, "card" for sideways-scrolling grids. */
  variant?: "row" | "card"
}) {
  if (!product) {
    return null
  }

  const { cheapestPrice } = getProductPrice({
    product,
  })

  const brand = (product.metadata?.brand as string | undefined) || undefined

  const inventoryQuantity = product.variants?.reduce((acc, variant) => {
    return acc + (variant?.inventory_quantity || 0)
  }, 0)

  const partNumber = product.variants?.[0]?.sku
  const stock =
    inventoryQuantity === undefined ? null : inventoryQuantity > 0 ? (
      <span>{inventoryQuantity} in stock</span>
    ) : (
      <span>Out of stock</span>
    )

  // Lists show a dense row; the home page rail keeps the card.
  if (!isFeatured) {
    const Layout = variant === "card" ? PartCard : PartRow
    return (
      <Layout
        href={`/products/${product.handle}`}
        title={product.title}
        brand={brand}
        partNumber={partNumber}
        thumbnail={product.thumbnail}
        images={product.images}
        stock={stock}
        price={
          cheapestPrice ? (
            <>
              <PreviewPrice price={cheapestPrice} />
              <Text className="text-neutral-700 text-xs">Excl. VAT</Text>
            </>
          ) : (
            <Text className="text-ui-fg-base font-medium" data-testid="price-on-request">
              Price on request
            </Text>
          )
        }
        action={
          cheapestPrice ? (
            <PreviewAddToCart product={product} region={region} />
          ) : null
        }
      />
    )
  }

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div
        data-testid="product-wrapper"
        className="flex flex-col gap-4 relative aspect-[3/5] w-full overflow-hidden p-4 bg-white shadow-borders-base rounded-lg group-hover:shadow-[0_0_0_4px_rgba(0,0,0,0.1)] transition-shadow ease-in-out duration-150"
      >
        <div className="w-full h-full p-10">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            isFeatured={isFeatured}
          />
        </div>
        <div className="flex flex-col txt-compact-medium">
          <Text className="text-neutral-700 text-xs" data-testid="product-brand">
            {brandLabel(brand)}
          </Text>
          <Text className="text-ui-fg-base" data-testid="product-title">
            {product.title}
          </Text>
        </div>
        <div className="flex flex-col gap-0">
          {cheapestPrice ? (
            <>
              <PreviewPrice price={cheapestPrice} />
              <Text className="text-neutral-600 text-xs">Excl. VAT</Text>
            </>
          ) : (
            <Text className="text-ui-fg-base font-medium" data-testid="price-on-request">
              Price on request
            </Text>
          )}
        </div>
        <div className="flex justify-between">
          <div className="flex flex-row gap-1 items-center">
            <span
              className={clx({
                "text-green-500": inventoryQuantity && inventoryQuantity > 50,
                "text-orange-500":
                  inventoryQuantity &&
                  inventoryQuantity <= 50 &&
                  inventoryQuantity > 0,
                "text-red-500": inventoryQuantity === 0,
              })}
            >
              •
            </span>
            <Text className="text-neutral-600 text-xs">
              {inventoryQuantity} left
            </Text>
          </div>
          <PreviewAddToCart product={product} region={region} />
        </div>
      </div>
    </LocalizedClientLink>
  )
}
