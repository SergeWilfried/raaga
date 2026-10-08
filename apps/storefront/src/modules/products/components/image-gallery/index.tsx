"use client"

import { ArrowLeftMini, ArrowRightMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@medusajs/ui"
import PlaceholderImage from "@/modules/common/icons/placeholder-image"
import Image from "next/image"
import { useMemo, useState } from "react"

type GalleryImage = {
  id: string
  url: string
  alt?: string
}

type ImageGalleryProps = {
  product: HttpTypes.StoreProduct
}

/**
 * Photos of one part. One image shows as a plain picture; several get arrows,
 * a counter and a strip of thumbnails. Everything is reachable by keyboard, and
 * the arrow keys only act while the gallery has focus.
 */
const ImageGallery = ({ product }: ImageGalleryProps) => {
  const images = useMemo<GalleryImage[]>(() => {
    const fromProduct = (product.images ?? [])
      .filter((image) => Boolean(image.url))
      .map((image) => ({
        id: image.id,
        url: image.url,
        alt: (image.metadata?.alt as string | undefined) || undefined,
      }))

    if (fromProduct.length) {
      return fromProduct
    }

    return product.thumbnail
      ? [{ id: "thumbnail", url: product.thumbnail }]
      : []
  }, [product])

  const [index, setIndex] = useState(0)

  const total = images.length
  const current = total ? images[Math.min(index, total - 1)] : null
  const goTo = (next: number) =>
    setIndex(Math.min(total - 1, Math.max(0, next)))

  return (
    <div
      className="flex flex-col gap-3 w-full"
      role="group"
      aria-roledescription="carousel"
      aria-label={`Photos of ${product.title}`}
      tabIndex={total > 1 ? 0 : undefined}
      onKeyDown={(event) => {
        if (total < 2) return
        if (event.key === "ArrowLeft") goTo(index - 1)
        if (event.key === "ArrowRight") goTo(index + 1)
      }}
      data-testid="image-gallery"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-neutral-200 bg-white">
        {current ? (
          <Image
            src={current.url}
            alt={current.alt ?? `${product.title}, photo ${index + 1} of ${total}`}
            fill
            priority
            className="object-contain p-4"
            sizes="(max-width: 1024px) 100vw, 640px"
          />
        ) : (
          <div
            className="flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-100 text-neutral-700"
            role="img"
            aria-label="No photo available for this part"
            data-testid="product-image-placeholder"
          >
            <PlaceholderImage size={56} />
            <span className="text-sm">No photo available</span>
          </div>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              disabled={index === 0}
              onClick={() => goTo(index - 1)}
              className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-white"
            >
              <ArrowLeftMini />
            </button>
            <button
              type="button"
              aria-label="Next photo"
              disabled={index === total - 1}
              onClick={() => goTo(index + 1)}
              className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-white"
            >
              <ArrowRightMini />
            </button>
            <span
              className="absolute bottom-2 right-2 rounded-full bg-neutral-900 px-2.5 py-1 text-xs font-medium text-white"
              aria-live="polite"
              data-testid="gallery-counter"
            >
              {index + 1} / {total}
            </span>
          </>
        )}
      </div>

      <ul className="flex gap-2 overflow-x-auto p-1" aria-label="Choose a photo" data-testid="gallery-thumbnails">
        {total === 0 && (
          <li className="shrink-0" aria-hidden="true">
            <div className="flex h-16 w-16 items-center justify-center rounded-md border border-dashed border-neutral-300 bg-neutral-100 text-neutral-600">
              <PlaceholderImage size={24} />
            </div>
          </li>
        )}
        {images.map((image, i) => (
            <li key={image.id} className="shrink-0">
              <button
                type="button"
                aria-label={`Show photo ${i + 1} of ${total}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={clx(
                  "relative block h-16 w-16 overflow-hidden rounded-md border bg-white",
                  i === index
                    ? "border-ui-fg-interactive ring-2 ring-ui-fg-interactive"
                    : "border-neutral-300 opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </button>
            </li>
        ))}
      </ul>
    </div>
  )
}

export default ImageGallery
