import { brandLabel } from "@/lib/util/brand"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

/** Brand, name and part number: what a buyer checks first against their label. */
const ProductInfo = ({ product }: ProductInfoProps) => {
  const brand = product.metadata?.brand as string | undefined
  const partNumber = product.variants?.[0]?.sku

  return (
    <div id="product-info" className="flex flex-col gap-2 min-w-0">
      <Text className="text-sm font-medium text-neutral-700" data-testid="product-brand">
        {brandLabel(brand)}
      </Text>
      <Heading
        level="h1"
        className="text-2xl small:text-3xl leading-tight text-ui-fg-base break-words"
        data-testid="product-title"
      >
        {product.title}
      </Heading>
      {partNumber && (
        <Text className="font-mono text-base text-neutral-800 break-all" data-testid="part-number">
          Part no. {partNumber}
        </Text>
      )}
      {product.subtitle && (
        <Text className="text-base text-neutral-700 whitespace-pre-line" data-testid="product-description">
          {product.subtitle}
        </Text>
      )}
    </div>
  )
}

export default ProductInfo
