"use client"

import { currencySymbolMap } from "@/lib/constants"
import { signup } from "@/lib/data/customer"
import { LOGIN_VIEW } from "@/modules/account/templates/login-template"
import { kybLabels } from "@/lib/kyb"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"
import { ChangeEvent, useActionState, useEffect, useRef, useState } from "react"
import {
  AuthError,
  AuthField,
  AuthHeading,
  AuthSelect,
  AuthSubmit,
  AuthSwitch,
} from "../auth-ui"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  regions: HttpTypes.StoreRegion[]
}

interface FormData {
  email: string
  first_name: string
  last_name: string
  company_name: string
  password: string
  company_address: string
  company_city: string
  company_state: string
  company_zip: string
  company_country: string
  currency_code: string
  registration_number: string
  tax_id: string
}

const initialFormData: FormData = {
  email: "",
  first_name: "",
  last_name: "",
  company_name: "",
  password: "",
  company_address: "",
  company_city: "",
  company_state: "",
  company_zip: "",
  company_country: "",
  currency_code: "",
  registration_number: "",
  tax_id: "",
}

const STEPS = [
  { title: "Your account", short: "Account" },
  { title: "Your company", short: "Company" },
  { title: "Verify your business", short: "Verification" },
]

const Register = ({ setCurrentView, regions }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const [step, setStep] = useState(0)
  const stepRef = useRef<HTMLDivElement>(null)

  const stepValid = [
    !!formData.email &&
      /.+@.+\..+/.test(formData.email) &&
      !!formData.first_name.trim() &&
      !!formData.last_name.trim() &&
      formData.password.length >= 8,
    !!formData.company_name.trim() &&
      !!formData.company_address.trim() &&
      !!formData.company_city.trim() &&
      !!formData.company_zip.trim() &&
      !!formData.company_country &&
      !!formData.currency_code,
    termsAccepted,
  ]
  const isValid = stepValid.every(Boolean)
  const lastStep = STEPS.length - 1

  // Move focus to the new step so keyboard and screen-reader users land on it.
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    stepRef.current?.focus()
  }, [step])

  const goNext = () => stepValid[step] && setStep((n) => Math.min(n + 1, lastStep))

  const countryNames = [
    ...new Set(
      regions
        .flatMap((region) =>
          region.countries?.map((c) => c?.display_name || c?.name)
        )
        .filter((country): country is string => !!country)
    ),
  ]

  const kyb = kybLabels(formData.company_country)

  const currencies = [...new Set(regions.map((region) => region.currency_code))]

  return (
    <div
      className="flex w-full max-w-xl flex-col gap-8"
      data-testid="register-page"
    >
      <AuthHeading sub="Buy and request quotes for your mine or plant. We check your business details before approving the account.">
        Create a company account
      </AuthHeading>
      <nav aria-label="Progress">
        <ol className="flex gap-2">
          {STEPS.map((st, i) => (
            <li key={st.short} className="flex-1" aria-current={i === step ? "step" : undefined}>
              <div className={`h-1.5 rounded-full ${i <= step ? "bg-brand" : "bg-neutral-300"}`} />
              <span className={`mt-2 block text-sm ${i === step ? "font-bold text-neutral-950" : "text-neutral-700"}`}>
                <span className="sr-only">Step </span>{i + 1}
                <span className="hidden small:inline">. {st.short}</span>
              </span>
            </li>
          ))}
        </ol>
      </nav>
      <form
        className="flex flex-col gap-8"
        action={formAction}
        noValidate
        onSubmit={(e) => {
          // Enter on an early step moves on instead of submitting.
          if (step < lastStep || !isValid) {
            e.preventDefault()
            goNext()
          }
        }}
      >
        <div
          ref={stepRef}
          tabIndex={-1}
          aria-live="polite"
          className="outline-none"
        >
          <h2 className="border-b-2 border-neutral-950 pb-2 text-lg font-bold text-neutral-950">
            Step {step + 1} of {STEPS.length}: {STEPS[step].title}
          </h2>
        </div>

        <div className={step === 0 ? "flex flex-col gap-4" : "hidden"}>
          <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
            <AuthField
              label="First name"
              name="first_name"
              required
              autoComplete="given-name"
              data-testid="first-name-input"
              value={formData.first_name}
              onChange={handleChange}
            />
            <AuthField
              label="Last name"
              name="last_name"
              required
              autoComplete="family-name"
              data-testid="last-name-input"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <AuthField
            label="Work email"
            name="email"
            type="email"
            required
            autoComplete="email"
            data-testid="email-input"
            value={formData.email}
            onChange={handleChange}
          />
          <AuthField
            label="Password (8 characters or more)"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            data-testid="password-input"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div className={step === 1 ? "flex flex-col gap-4" : "hidden"}>
          <AuthField
            label="Company name"
            name="company_name"
            required
            autoComplete="organization"
            data-testid="company-name-input"
            value={formData.company_name}
            onChange={handleChange}
          />
          <AuthField
            label="Address"
            name="company_address"
            required
            autoComplete="street-address"
            data-testid="company-address-input"
            value={formData.company_address}
            onChange={handleChange}
          />
          <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
            <AuthField
              label="City"
              name="company_city"
              required
              autoComplete="address-level2"
              data-testid="company-city-input"
              value={formData.company_city}
              onChange={handleChange}
            />
            <AuthField
              label="Region or state"
              name="company_state"
              autoComplete="address-level1"
              data-testid="company-state-input"
              value={formData.company_state}
              onChange={handleChange}
            />
            <AuthField
              label="Postal code"
              name="company_zip"
              required
              autoComplete="postal-code"
              data-testid="company-zip-input"
              value={formData.company_zip}
              onChange={handleChange}
            />
            <AuthSelect
              label="Country"
              name="company_country"
              placeholder="Select a country"
              required
              autoComplete="country-name"
              data-testid="company-country-input"
              value={formData.company_country}
              onChange={handleChange}
            >
              {countryNames.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </AuthSelect>
          </div>
          <AuthSelect
            label="Currency"
            name="currency_code"
            placeholder="Select a currency"
            required
            data-testid="company-currency-input"
            value={formData.currency_code}
            onChange={handleChange}
          >
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency.toUpperCase()} ({currencySymbolMap[currency]})
              </option>
            ))}
          </AuthSelect>
        </div>
        <div className={step === 2 ? "flex flex-col gap-4" : "hidden"}>
          <AuthField
            label={kyb.registration.en}
            name="registration_number"
            autoComplete="off"
            data-testid="company-registration-input"
            value={formData.registration_number}
            onChange={handleChange}
          />
          <AuthField
            label={kyb.taxId.en}
            name="tax_id"
            autoComplete="off"
            data-testid="company-tax-id-input"
            value={formData.tax_id}
            onChange={handleChange}
            hint="Optional now, but we need them to verify and approve your business account."
          />
        <label
          htmlFor="terms-checkbox"
          className="flex min-h-11 cursor-pointer items-start gap-3 text-base text-neutral-950"
          data-testid="terms-label"
        >
          <input
            type="checkbox"
            id="terms-checkbox"
            name="terms"
            data-testid="terms-checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 h-6 w-6 shrink-0 cursor-pointer accent-[var(--brand)]"
          />
          <span>
            I agree to the{" "}
            <LocalizedClientLink href="/terms" className="font-semibold underline underline-offset-4">
              terms
            </LocalizedClientLink>{" "}
            and{" "}
            <LocalizedClientLink href="/privacy" className="font-semibold underline underline-offset-4">
              privacy policy
            </LocalizedClientLink>
            .
          </span>
        </label>

        </div>

        <AuthError error={message} data-testid="register-error" />
        <div className="flex flex-col-reverse gap-3 small:flex-row">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((n) => n - 1)}
              data-testid="register-back"
              className="inline-flex min-h-14 items-center justify-center rounded-lg border-2 border-neutral-950 px-6 text-base font-semibold text-neutral-950 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-950/30"
            >
              Back
            </button>
          )}
          {step < lastStep ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!stepValid[step]}
              data-testid="register-next"
              className="inline-flex min-h-14 flex-1 items-center justify-center rounded-lg bg-brand px-6 text-base font-semibold text-white hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-950/40 disabled:cursor-not-allowed disabled:bg-neutral-300 disabled:text-neutral-700"
            >
              Continue
            </button>
          ) : (
            <div className="flex-1">
              <AuthSubmit data-testid="register-button" disabled={!isValid}>
                Create account
              </AuthSubmit>
            </div>
          )}
        </div>
      </form>
      <AuthSwitch
        prompt="Already have an account?"
        action="Log in"
        onClick={() => setCurrentView(LOGIN_VIEW.LOG_IN)}
      />
    </div>
  )
}

export default Register
