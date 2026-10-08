"use client"

import { PRODUCT_INDEX_NAME, searchClient } from "@/lib/search-client"
import PartSearchBox from "@/modules/store/components/search/part-search-box"
import AppliedRefinements from "@/modules/store/components/search/applied-refinements"
import SearchRefinements from "@/modules/store/components/search/search-refinements"
import SearchResults from "@/modules/store/components/search/search-results"
import StoreBreadcrumb from "@/modules/store/components/store-breadcrumb"
import type { SearchClient } from "instantsearch.js"
import { Configure, InstantSearch } from "react-instantsearch"

const HITS_PER_PAGE = 12

const SearchStoreTemplate = ({
  currencyCode,
  heading,
}: {
  currencyCode: string
  heading: string
}) => (
  <div className="bg-neutral-100">
    <div
      className="flex flex-col py-6 content-container gap-4"
      data-testid="category-container"
    >
      <StoreBreadcrumb />
      <h1 className="font-display text-3xl font-black uppercase leading-none text-ui-fg-base [font-variation-settings:'wdth'_72] small:text-4xl">
        {heading}
      </h1>

      <InstantSearch
        indexName={PRODUCT_INDEX_NAME}
        searchClient={searchClient as unknown as SearchClient}
        routing
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure hitsPerPage={HITS_PER_PAGE} />

        <div className="flex flex-col small:flex-row small:items-start gap-3">
          <SearchRefinements currencyCode={currencyCode} />
          <div className="w-full flex flex-col gap-3">
            <PartSearchBox />
            <AppliedRefinements currencyCode={currencyCode} />
            <SearchResults currencyCode={currencyCode} />
          </div>
        </div>
      </InstantSearch>
    </div>
  </div>
)

export default SearchStoreTemplate
