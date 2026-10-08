import { HttpTypes } from "@medusajs/types"
import ImageGallery from "@/modules/products/components/image-gallery"
import ProductActions from "@/modules/products/components/product-actions"
import ProductDetails from "@/modules/products/components/product-details"
import RelatedProducts from "@/modules/products/components/related-products"
import ProductInfo from "@/modules/products/templates/product-info"
import SkeletonRelatedProducts from "@/modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import React, { Suspense } from "react"
import ProductActionsWrapper from "./product-actions-wrapper"
import ProductFacts from "../components/product-facts"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="flex flex-col gap-y-8 my-4">
      <div
        className="content-container grid grid-cols-1 gap-y-6 small:grid-cols-[minmax(0,1fr)_24rem] small:gap-x-8"
        data-testid="product-container"
      >
        <ProductInfo product={product} />

        {/* The buy block follows the title on phones and sits beside the
            details, pinned, on larger screens. */}
        <aside className="flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-5 small:col-start-2 small:row-span-2 small:row-start-1 small:sticky small:top-20 small:self-start">
          <ProductFacts product={product} />
          <Suspense
            fallback={<ProductActions product={product} region={region} />}
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>
        </aside>

        <div className="flex flex-col gap-6 min-w-0 small:col-start-1">
          <ImageGallery product={product} />
          <ProductDetails product={product} />
        </div>
      </div>

      <div
        className="content-container"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </div>
  )
}

export default ProductTemplate
