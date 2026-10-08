"use client"

import { addToCartEventBus } from "@/lib/data/cart-event-bus"
import Button from "@/modules/common/components/button"
import ShoppingBag from "@/modules/common/icons/shopping-bag"
import { HttpTypes } from "@medusajs/types"
import { useState } from "react"
import QuantityStepper from "../quantity-stepper"

/**
 * The buy control for a part with one variant (nearly all of them): a quantity
 * that starts at 1 and one button, instead of a one-row variants table.
 */
const SingleVariantBuy = ({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) => {
  const variant = product.variants![0]
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const stock = variant.manage_inventory
    ? (variant.inventory_quantity ?? 0)
    : undefined

  const handleAdd = () => {
    setIsAdding(true)
    addToCartEventBus.emitCartAdd({
      lineItems: [{ productVariant: { ...variant, product }, quantity }],
      regionId: region.id,
    })
    setIsAdding(false)
  }

  return (
    <div className="flex flex-col gap-3">
      <QuantityStepper
        value={quantity}
        onChange={setQuantity}
        max={stock && stock > 0 ? stock : undefined}
        label="Quantity"
      />
      <Button
        onClick={handleAdd}
        variant="primary"
        className="h-11 w-full"
        isLoading={isAdding}
        disabled={stock === 0}
        data-testid="add-product-button"
      >
        <ShoppingBag className="text-white" fill="#fff" />
        {stock === 0 ? "Out of stock" : "Add to cart"}
      </Button>
    </div>
  )
}

export default SingleVariantBuy
