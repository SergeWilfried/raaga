"use client"

import Login from "@/modules/account/components/login"
import Register from "@/modules/account/components/register"
import LocalizedClientLink from "@/modules/common/components/localized-client-link"
import Wordmark from "@/modules/common/components/wordmark"
import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export enum LOGIN_VIEW {
  LOG_IN = "log-in",
  REGISTER = "register",
}

const PHOTO =
  "https://images.unsplash.com/photo-1711012604128-8339024a3e12?auto=format&fit=crop&w=1400&q=80"

const LoginTemplate = ({ regions }: { regions: HttpTypes.StoreRegion[] }) => {
  const route = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const [currentView, setCurrentView] = useState<LOGIN_VIEW>(() => {
    const viewFromUrl = searchParams.get("view") as LOGIN_VIEW
    return viewFromUrl && Object.values(LOGIN_VIEW).includes(viewFromUrl)
      ? viewFromUrl
      : LOGIN_VIEW.LOG_IN
  })

  useEffect(() => {
    if (searchParams.has("view")) {
      const newParams = new URLSearchParams(searchParams)
      newParams.delete("view")
      router.replace(
        `${route}${newParams.toString() ? `?${newParams.toString()}` : ""}`,
        { scroll: false }
      )
    }
  }, [searchParams, route, router])

  const updateView = (view: LOGIN_VIEW) => {
    setCurrentView(view)
    router.push(`/account?view=${view}`)
  }

  return (
    <div className="grid min-h-[80vh] grid-cols-1 small:grid-cols-[minmax(0,5fr)_minmax(0,4fr)]">
      <div className="flex justify-center bg-white px-6 py-12 small:px-12 small:py-16">
        {currentView === LOGIN_VIEW.LOG_IN ? (
          <Login setCurrentView={updateView} />
        ) : (
          <Register setCurrentView={updateView} regions={regions} />
        )}
      </div>

      <aside className="relative hidden flex-col justify-between overflow-hidden bg-brand text-white small:flex">
        <div className="relative z-10 flex flex-col gap-4 p-12">
          <Wordmark className="!text-white" />
          <p className="font-display text-4xl font-black uppercase leading-[0.95] [font-variation-settings:'wdth'_62] text-balance">
            Spare parts from mines and plants, already in the region.
          </p>
          <LocalizedClientLink
            href="/suppliers"
            className="inline-flex min-h-11 w-fit items-center font-semibold underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            Have surplus parts to sell?
          </LocalizedClientLink>
        </div>
        <div className="relative min-h-[18rem] flex-1">
          <Image
            src={PHOTO}
            alt="Excavator loading a truck at an open-pit mine"
            fill
            sizes="(min-width: 1024px) 45vw, 0px"
            className="object-cover"
          />
        </div>
      </aside>
    </div>
  )
}

export default LoginTemplate
