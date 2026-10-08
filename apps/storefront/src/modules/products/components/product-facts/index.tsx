import { CheckCircleSolid, ExclamationCircleSolid, XCircleSolid } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"

/**
 * Stock, in words and with an icon, so it never rests on colour alone.
 */
const ProductFacts = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const managedVariants = product.variants?.filter(
    (variant) => variant.manage_inventory !== false
  )

  if (!managedVariants?.length) {
    return null
  }

  const inventoryQuantity = managedVariants.reduce(
    (acc, variant) => acc + (variant.inventory_quantity ?? 0),
    0
  )

  const state =
    inventoryQuantity === 0
      ? {
          Icon: XCircleSolid,
          tone: "text-red-700",
          text: "Out of stock",
        }
      : inventoryQuantity > 10
        ? {
            Icon: CheckCircleSolid,
            tone: "text-green-700",
            text: `In stock (${inventoryQuantity} available)`,
          }
        : {
            Icon: ExclamationCircleSolid,
            tone: "text-orange-700",
            text: `Limited stock (${inventoryQuantity} available)`,
          }

  return (
    <p
      className={`flex items-center gap-x-2 text-sm font-medium ${state.tone}`}
      data-testid="product-stock"
    >
      <state.Icon aria-hidden="true" />
      {state.text}
    </p>
  )
}

export default ProductFacts
