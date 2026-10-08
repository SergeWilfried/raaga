import { clx } from "@medusajs/ui"

/** The Raaga name, set in the display face used on the landing page and footer. */
const Wordmark = ({ className }: { className?: string }) => (
  <span
    className={clx(
      "font-display text-2xl font-black uppercase leading-none text-ui-fg-base [font-variation-settings:'wdth'_70]",
      className
    )}
  >
    Raaga
  </span>
)

export default Wordmark
