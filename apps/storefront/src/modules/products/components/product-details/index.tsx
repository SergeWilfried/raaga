import { brandLabel } from "@/lib/util/brand"
import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@medusajs/ui"
import Markdown from "react-markdown"

// Internal equipment ids such as "DR-101" mean nothing to a buyer.
const INTERNAL_EQUIPMENT_ID = /^[A-Z]{2}-\d+$/

const text = (value: unknown): string | undefined => {
  if (typeof value === "number") return String(value)
  if (typeof value !== "string") return undefined
  const trimmed = value.trim()
  return trimmed && trimmed !== "#" ? trimmed : undefined
}

/**
 * What the part is, as a plain two-column list. Only fields a buyer can use are
 * shown; client names, sites, quantities and costs stay out of customer view.
 */
const ProductDetails = ({ product }: { product: HttpTypes.StoreProduct }) => {
  const m = (product.metadata ?? {}) as Record<string, unknown>

  const equipment = text(m.equipment_model) ?? text(m.equipment)
  const dimensions =
    product.length && product.width && product.height
      ? `${product.length} × ${product.width} × ${product.height} mm`
      : undefined

  const rows: [string, string | undefined][] = [
    ["Part number", product.variants?.[0]?.sku ?? undefined],
    ["Brand", brandLabel(text(m.brand))],
    ["Manufacturer part no.", text(m.manufacturer_part_number)],
    ["Fits equipment", equipment && !INTERNAL_EQUIPMENT_ID.test(equipment) ? equipment : undefined],
    ["Unit", text(m.unit)],
    ["Condition", text(m.condition)],
    ["GTIN", text(m.gtin)],
    ["Material", text(product.material)],
    ["Weight", product.weight ? `${product.weight} g` : undefined],
    ["Dimensions", dimensions],
    ["Country of origin", text(product.origin_country)],
  ]
  const shown = rows.filter((row): row is [string, string] => Boolean(row[1]))

  return (
    <section className="flex flex-col gap-4" aria-labelledby="part-details-heading">
      <Heading level="h2" id="part-details-heading" className="text-lg text-ui-fg-base">
        Part details
      </Heading>

      {shown.length > 0 && (
        <dl
          className="overflow-hidden rounded-lg border border-neutral-200 bg-white"
          data-testid="part-details"
        >
          {shown.map(([label, value]) => (
            <div
              key={label}
              className="grid grid-cols-[9rem_minmax(0,1fr)] gap-x-4 border-b border-neutral-200 px-4 py-3 last:border-b-0 small:grid-cols-[12rem_minmax(0,1fr)]"
            >
              <dt className="text-sm text-neutral-700">{label}</dt>
              <dd className="text-sm font-medium text-ui-fg-base break-words">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {product.description && (
        <div className="max-w-prose">
          <Markdown
            components={{
              p: ({ children }) => <Text className="mb-2 text-neutral-950">{children}</Text>,
              h2: ({ children }) => <Text className="my-4 text-lg font-semibold text-neutral-950">{children}</Text>,
              h3: ({ children }) => <Text className="mb-2 text-base font-semibold text-neutral-950">{children}</Text>,
            }}
          >
            {product.description}
          </Markdown>
        </div>
      )}
    </section>
  )
}

export default ProductDetails
