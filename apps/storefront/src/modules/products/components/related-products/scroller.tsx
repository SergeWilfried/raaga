"use client"

import { ArrowLeftMini, ArrowRightMini } from "@medusajs/icons"
import { ReactNode, useCallback, useEffect, useRef, useState } from "react"

/**
 * One sideways-scrolling row with its own previous and next buttons. Each row
 * keeps its own scroll position. Touch users swipe, keyboard users scroll with
 * the arrow keys once the row has focus, and the buttons (for mouse users)
 * disable at the ends.
 */
const Scroller = ({ label, children }: { label: string; children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null)
  const [edges, setEdges] = useState({ start: true, end: true })

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setEdges({
      start: el.scrollLeft <= 1,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
    })
  }, [])

  useEffect(() => {
    update()
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [update])

  const scrollByPage = (direction: -1 | 1) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({
      left: direction * el.clientWidth * 0.85,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    })
  }

  const hasOverflow = !(edges.start && edges.end)

  const arrow =
    "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 shadow-sm hover:bg-neutral-100 disabled:hidden small:flex"

  return (
    <div className="relative">
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        onScroll={update}
        className="overflow-x-auto overscroll-x-contain scroll-smooth rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-interactive [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        data-testid="related-scroller"
      >
        {children}
      </div>
      {hasOverflow && (
        <>
          <button
            type="button"
            aria-label={`${label}: scroll left`}
            disabled={edges.start}
            onClick={() => scrollByPage(-1)}
            className={`${arrow} left-2`}
          >
            <ArrowLeftMini />
          </button>
          <button
            type="button"
            aria-label={`${label}: scroll right`}
            disabled={edges.end}
            onClick={() => scrollByPage(1)}
            className={`${arrow} right-2`}
          >
            <ArrowRightMini />
          </button>
        </>
      )}
    </div>
  )
}

export default Scroller
