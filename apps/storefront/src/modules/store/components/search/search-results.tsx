"use client"

import useSearchSettled from "@/lib/hooks/use-search-settled"
import type { ProductHit } from "@/modules/layout/components/search/hit"
import SkeletonProductGrid from "@/modules/skeletons/templates/skeleton-product-grid"
import { Button, Container, Text } from "@medusajs/ui"
import { useHits, useInstantSearch, useStats } from "react-instantsearch"

import ProductHitCard from "./product-hit-card"
import SearchPagination from "./search-pagination"

const SearchResults = ({ currencyCode }: { currencyCode: string }) => {
  const { items } = useHits<ProductHit>()
  const { nbHits } = useStats()
  const { status, error, refresh } = useInstantSearch()
  const { isSettled } = useSearchSettled()

  if (status === "error") {
    const errorStatus = (error as unknown as { status?: number } | undefined)
      ?.status

    return (
      <Container
        className="flex flex-col items-center gap-3 py-8 text-center text-sm"
        role="alert"
      >
        <Text className="font-medium text-ui-fg-base">
          We couldn&apos;t load the parts list.
        </Text>
        <Text className="text-neutral-700">
          Check your connection and try again.
          {errorStatus ? ` (error ${errorStatus})` : ""}
        </Text>
        <Button variant="secondary" onClick={() => refresh()}>
          Try again
        </Button>
      </Container>
    )
  }

  if (!items.length && !isSettled) {
    return <SkeletonProductGrid />
  }

  return (
    <div className="flex flex-col gap-4">
      <Text className="text-sm text-neutral-500" data-testid="product-count">
        {nbHits} {nbHits === 1 ? "product" : "products"}
      </Text>

      {items.length === 0 ? (
        <Container className="text-center text-sm text-neutral-500">
          No products match these filters.
        </Container>
      ) : (
        <ul
          className="flex flex-col w-full overflow-hidden rounded-lg border border-neutral-200 bg-white"
          data-testid="products-list"
        >
          {items.map((hit) => (
            <li key={hit.objectID}>
              <ProductHitCard hit={hit} currencyCode={currencyCode} />
            </li>
          ))}
        </ul>
      )}

      <SearchPagination />
    </div>
  )
}

export default SearchResults
