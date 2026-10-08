import { getContactChannels } from "@/lib/contact"
import { downloadLabel, draftNotice, getPageCopy, PageKey } from "@/lib/pages-copy"
import type { Lang } from "@/lib/landing-copy"
import { Heading } from "@medusajs/ui"

type InfoPageProps = {
  pageKey: PageKey
  lang: Lang
  /** Show the configured contact channels under the text. */
  showContact?: boolean
  /** Legal text still waiting for review. */
  draft?: boolean
  /** A file to offer for download under the text. */
  download?: string
}

/** A plain, readable text page: one column, short line length, clear headings. */
const InfoPage = ({ pageKey, lang, showContact, draft, download }: InfoPageProps) => {
  const page = getPageCopy(pageKey, lang)
  const channels = showContact ? getContactChannels() : []
  const reviewed = process.env.NEXT_PUBLIC_LEGAL_REVIEWED === "true"

  return (
    <article className="content-container py-14" data-testid={`page-${pageKey}`}>
      <div className="flex max-w-prose flex-col gap-8">
        {draft && !reviewed && (
          <p className="rounded-lg border border-neutral-300 bg-neutral-100 px-4 py-3 text-sm text-neutral-800" role="note">
            {draftNotice[lang]}
          </p>
        )}

        <header className="flex flex-col gap-3">
          <Heading
            level="h1"
            className="font-display text-4xl font-black uppercase leading-none text-ui-fg-base [font-variation-settings:'wdth'_72] small:text-6xl"
          >
            {page.title}
          </Heading>
          <p className="text-lg leading-snug text-neutral-800">{page.intro}</p>
        </header>

        {page.sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-ui-fg-base">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-neutral-800">
                {paragraph}
              </p>
            ))}
          </section>
        ))}

        {download && (
          <a
            href={download}
            download
            className="inline-flex min-h-14 w-fit items-center justify-center rounded-lg bg-brand px-6 py-3 text-center text-base font-semibold text-white hover:bg-brand-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-neutral-950/40"
            data-testid="sheet-download"
          >
            {downloadLabel[lang]}
          </a>
        )}

        {channels.length > 0 && (
          <ul className="flex flex-col gap-2" data-testid="contact-channels">
            {channels.map((channel) => (
              <li key={channel.id}>
                <a
                  href={channel.href}
                  target={channel.id === "whatsapp" ? "_blank" : undefined}
                  rel={channel.id === "whatsapp" ? "noopener noreferrer" : undefined}
                  className="flex min-h-14 items-center justify-between gap-4 rounded-lg border border-neutral-300 px-4 py-3 text-base text-ui-fg-base hover:border-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-fg-interactive"
                >
                  <span className="font-semibold">{channel.label}</span>
                  <span className="break-all text-neutral-800">{channel.value}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  )
}

export default InfoPage
