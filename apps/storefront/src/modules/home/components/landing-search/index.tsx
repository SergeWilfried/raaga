"use client"

import { useParams, useRouter } from "next/navigation"
import { FormEvent, useId, useState } from "react"

type LandingSearchProps = {
  label: string
  placeholder: string
  button: string
  tryLabel: string
  examples: readonly string[]
  /** "onBrand" sits on the brand colour; "onLight" on a light surface. */
  tone?: "onBrand" | "onLight"
  testIdPrefix?: string
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
  tone = "onBrand",
  testIdPrefix = "landing-search",
}: LandingSearchProps) => {
  const inputId = useId()
  const light = tone === "onLight"
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
        <label htmlFor={inputId} className="sr-only">
          {label}
        </label>
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
          enterKeyHint="search"
          data-testid={`${testIdPrefix}-input`}
          className={`h-14 w-full min-w-0 rounded-lg border-2 bg-white px-4 text-lg text-neutral-950 placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-950/40 ${light ? "border-neutral-400" : "border-white"}`}
        />
        <button
          type="submit"
          data-testid={`${testIdPrefix}-button`}
          className={`h-14 shrink-0 rounded-lg px-6 text-base font-semibold text-white focus-visible:outline-none focus-visible:ring-4 ${light ? "bg-brand hover:bg-brand-hover focus-visible:ring-neutral-950/40" : "bg-neutral-950 hover:bg-neutral-800 focus-visible:ring-white/60"}`}
        >
          {button}
        </button>
      </form>

      <div className={`flex flex-wrap items-center gap-2 text-sm ${light ? "text-neutral-900" : "text-white"}`}>
        <span>{tryLabel}</span>
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => go(example)}
            className={`rounded-full border px-3 py-1.5 font-medium focus-visible:outline-none focus-visible:ring-2 ${light ? "border-neutral-500 text-neutral-900 hover:bg-neutral-950 hover:text-white focus-visible:ring-neutral-950" : "border-white/70 text-white hover:bg-white hover:text-neutral-950 focus-visible:ring-white"}`}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LandingSearch
