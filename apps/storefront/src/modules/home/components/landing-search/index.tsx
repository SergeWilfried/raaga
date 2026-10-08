"use client"

import { useParams, useRouter } from "next/navigation"
import { FormEvent, useState } from "react"

type LandingSearchProps = {
  label: string
  placeholder: string
  button: string
  tryLabel: string
  examples: readonly string[]
}

const storeUrl = (countryCode: string, query: string) =>
  `/${countryCode}/store${
    query.trim() ? `?product%5Bquery%5D=${encodeURIComponent(query.trim())}` : ""
  }`

/**
 * The first thing on the page: one large search field. It hands the query to the
 * parts list, which already searches part numbers first.
 */
const LandingSearch = ({
  label,
  placeholder,
  button,
  tryLabel,
  examples,
}: LandingSearchProps) => {
  const [value, setValue] = useState("")
  const { countryCode } = useParams<{ countryCode: string }>()
  const router = useRouter()

  const go = (query: string) => router.push(storeUrl(countryCode, query))

  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    go(value)
  }

  return (
    <div className="flex w-full max-w-xl flex-col gap-4">
      <form role="search" onSubmit={onSubmit} className="flex flex-col gap-2 small:flex-row">
        <label htmlFor="landing-search" className="sr-only">
          {label}
        </label>
        <input
          id="landing-search"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="search"
          data-testid="landing-search-input"
          className="h-14 w-full min-w-0 rounded-lg border-2 border-white bg-white px-4 text-lg text-neutral-950 placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-950/40"
        />
        <button
          type="submit"
          data-testid="landing-search-button"
          className="h-14 shrink-0 rounded-lg bg-neutral-950 px-6 text-base font-semibold text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/60"
        >
          {button}
        </button>
      </form>

      <div className="flex flex-wrap items-center gap-2 text-sm text-white">
        <span>{tryLabel}</span>
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => go(example)}
            className="rounded-full border border-white/70 px-3 py-1.5 font-medium text-white hover:bg-white hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LandingSearch
