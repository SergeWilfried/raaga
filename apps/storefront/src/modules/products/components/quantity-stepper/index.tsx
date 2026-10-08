"use client"

import { MinusMini, PlusMini } from "@medusajs/icons"

type QuantityStepperProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label: string
}

/** A quantity control with 44px targets, usable with a thumb in gloves or sun. */
const QuantityStepper = ({
  value,
  onChange,
  min = 1,
  max,
  label,
}: QuantityStepperProps) => {
  const clamp = (n: number) =>
    Math.min(max ?? Number.MAX_SAFE_INTEGER, Math.max(min, Math.floor(n) || min))

  return (
    <div
      className="flex w-fit items-center rounded-lg border border-neutral-300 bg-white"
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= min}
        onClick={() => onChange(clamp(value - 1))}
        className="flex h-11 w-11 items-center justify-center rounded-l-lg text-neutral-800 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <MinusMini />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="h-11 w-16 border-x border-neutral-300 text-center text-base text-ui-fg-base [appearance:textfield] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-interactive [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={max !== undefined && value >= max}
        onClick={() => onChange(clamp(value + 1))}
        className="flex h-11 w-11 items-center justify-center rounded-r-lg text-neutral-800 hover:bg-neutral-100 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <PlusMini />
      </button>
    </div>
  )
}

export default QuantityStepper
