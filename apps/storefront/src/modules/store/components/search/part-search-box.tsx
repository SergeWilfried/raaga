"use client"

import { MagnifyingGlass, XMarkMini } from "@medusajs/icons"
import { useEffect, useRef, useState } from "react"
import { useSearchBox } from "react-instantsearch"

const DEBOUNCE_MS = 250

/**
 * The query box above the parts list. Matches part numbers first (the index
 * weights them above names), then names and brands. Typing refines the list
 * after a short pause, so a slow connection isn't hit on every keystroke; the
 * query is kept in the URL so a result can be shared.
 */
const PartSearchBox = () => {
  const { query, refine } = useSearchBox()
  const [value, setValue] = useState(query)
  const lastRefined = useRef(query)

  // Follow the query when something else changes it (clear all, back button).
  useEffect(() => {
    if (query !== lastRefined.current) {
      lastRefined.current = query
      setValue(query)
    }
  }, [query])

  useEffect(() => {
    if (value === lastRefined.current) return
    const timer = setTimeout(() => {
      lastRefined.current = value
      refine(value)
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [value, refine])

  const submitNow = () => {
    lastRefined.current = value
    refine(value)
  }

  return (
    <form
      role="search"
      className="relative"
      onSubmit={(event) => {
        event.preventDefault()
        submitNow()
      }}
    >
      <label htmlFor="part-search" className="sr-only">
        Search by part number or name
      </label>
      <MagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-700" />
      <input
        id="part-search"
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Search by part number or name"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck={false}
        enterKeyHint="search"
        data-testid="part-search-input"
        className="h-12 w-full rounded-lg border border-neutral-300 bg-white pl-12 pr-12 text-base text-ui-fg-base placeholder:text-neutral-600 focus-visible:border-ui-fg-interactive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-interactive [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setValue("")}
          className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100"
        >
          <XMarkMini />
        </button>
      )}
    </form>
  )
}

export default PartSearchBox
