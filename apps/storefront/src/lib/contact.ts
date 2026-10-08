export type ContactChannel = { id: "email" | "phone" | "whatsapp"; label: string; value: string; href: string }

/**
 * Contact details, set in the storefront environment. Pages and footer links
 * that need a way to reach the company appear only when one is configured.
 *
 *   NEXT_PUBLIC_CONTACT_EMAIL     quotes@example.com
 *   NEXT_PUBLIC_CONTACT_PHONE     +226 70 00 00 00
 *   NEXT_PUBLIC_SOCIAL_WHATSAPP   https://wa.me/22670000000
 */
export const getContactChannels = (): ContactChannel[] => {
  const channels: ContactChannel[] = []
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim()
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE?.trim()
  const whatsapp = process.env.NEXT_PUBLIC_SOCIAL_WHATSAPP?.trim()

  if (email) channels.push({ id: "email", label: "Email", value: email, href: `mailto:${email}` })
  if (phone) channels.push({ id: "phone", label: "Phone", value: phone, href: `tel:${phone.replace(/[^\d+]/g, "")}` })
  if (whatsapp?.startsWith("http"))
    channels.push({ id: "whatsapp", label: "WhatsApp", value: whatsapp.replace(/^https?:\/\//, ""), href: whatsapp })

  return channels
}

export const hasContact = () => getContactChannels().length > 0
