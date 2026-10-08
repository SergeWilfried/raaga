"use client"

import Eye from "@/modules/common/icons/eye"
import EyeOff from "@/modules/common/icons/eye-off"
import { clx } from "@medusajs/ui"
import React, { useId, useState } from "react"
import { useFormStatus } from "react-dom"

/**
 * Form pieces for log in / register, in the landing-page voice: visible
 * labels (no floating placeholders), square-ish 56px fields with a 2px
 * border, brand-red actions. Keeps targets large for use on site.
 */

const fieldClass =
  "h-14 w-full min-w-0 rounded-lg border-2 border-neutral-400 bg-white px-4 text-base text-neutral-950 placeholder:text-neutral-600 hover:border-neutral-950 focus-visible:border-neutral-950 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-950/20"

type FieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string
  name: string
  hint?: string
}

export const AuthField = ({
  label,
  hint,
  required,
  type,
  className,
  ...props
}: FieldProps) => {
  const id = useId()
  const [show, setShow] = useState(false)
  const isPassword = type === "password"

  return (
    <div className={clx("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-neutral-950">
        {label}
        {!required && <span className="font-normal text-neutral-700"> (optional)</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          required={required}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={clx(fieldClass, isPassword && "pr-14")}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            className="absolute right-1 top-1 flex h-11 w-11 items-center justify-center rounded-md text-neutral-800 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
          >
            {show ? <Eye /> : <EyeOff />}
          </button>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-neutral-700">
          {hint}
        </p>
      )}
    </div>
  )
}

type SelectProps = Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> & {
  label: string
  name: string
  placeholder: string
  children: React.ReactNode
}

export const AuthSelect = ({
  label,
  placeholder,
  required,
  className,
  children,
  ...props
}: SelectProps) => {
  const id = useId()
  return (
    <div className={clx("flex min-w-0 flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-semibold text-neutral-950">
        {label}
        {!required && <span className="font-normal text-neutral-700"> (optional)</span>}
      </label>
      <select
        id={id}
        required={required}
        className={clx(fieldClass, "cursor-pointer appearance-none bg-[length:1.25rem] bg-[right_1rem_center] bg-no-repeat pr-12")}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23171717' stroke-width='2'%3E%3Cpath d='m5 8 5 5 5-5'/%3E%3C/svg%3E\")",
        }}
        {...props}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {children}
      </select>
    </div>
  )
}

export const AuthHeading = ({
  children,
  sub,
}: {
  children: React.ReactNode
  sub?: string
}) => (
  <div className="flex flex-col gap-3">
    <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-black uppercase leading-[0.95] tracking-[-0.01em] text-neutral-950 [font-variation-settings:'wdth'_62] text-balance">
      {children}
    </h1>
    {sub && <p className="max-w-md text-lg leading-snug text-neutral-900">{sub}</p>}
  </div>
)

export const AuthSubmit = ({
  children,
  disabled,
  "data-testid": testId,
}: {
  children: React.ReactNode
  disabled?: boolean
  "data-testid"?: string
}) => {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      data-testid={testId}
      className="inline-flex min-h-14 w-full items-center justify-center rounded-lg bg-brand px-6 py-3 text-base font-semibold text-white hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-950/40 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-700"
    >
      {pending ? "Please wait…" : children}
    </button>
  )
}

export const AuthSwitch = ({
  prompt,
  action,
  onClick,
  "data-testid": testId,
}: {
  prompt: string
  action: string
  onClick: () => void
  "data-testid"?: string
}) => (
  <p className="text-base text-neutral-900">
    {prompt}{" "}
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className="inline-flex min-h-11 items-center rounded-sm font-semibold underline underline-offset-4 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950"
    >
      {action}
    </button>
  </p>
)

export const AuthError = ({
  error,
  "data-testid": testId,
}: {
  error?: unknown
  "data-testid"?: string
}) => {
  if (!error || typeof error !== "string") return null
  return (
    <div
      role="alert"
      data-testid={testId}
      className="rounded-lg border-2 border-rose-700 bg-rose-50 px-4 py-3 text-base font-medium text-rose-900"
    >
      {error.replace(/^Error:\s*/, "")}
    </div>
  )
}

export const AuthSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <fieldset className="flex min-w-0 flex-col gap-4 border-0 p-0">
    <legend className="mb-1 border-b-2 border-neutral-950 pb-2 text-base font-bold text-neutral-950 w-full">
      {title}
    </legend>
    {children}
  </fieldset>
)
