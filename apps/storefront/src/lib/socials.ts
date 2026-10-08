export type SocialId =
  | "linkedin"
  | "facebook"
  | "instagram"
  | "x"
  | "youtube"
  | "whatsapp"

export type Social = { id: SocialId; label: string; href: string }

/**
 * Social accounts, set in the storefront environment. An icon shows only when
 * its address is set, so the footer never links to an account that isn't there.
 *
 *   NEXT_PUBLIC_SOCIAL_LINKEDIN   https://www.linkedin.com/company/...
 *   NEXT_PUBLIC_SOCIAL_FACEBOOK   https://www.facebook.com/...
 *   NEXT_PUBLIC_SOCIAL_INSTAGRAM  https://www.instagram.com/...
 *   NEXT_PUBLIC_SOCIAL_X          https://x.com/...
 *   NEXT_PUBLIC_SOCIAL_YOUTUBE    https://www.youtube.com/@...
 *   NEXT_PUBLIC_SOCIAL_WHATSAPP   https://wa.me/<number, digits only>
 */
export const getSocials = (): Social[] => {
  const all: Social[] = [
    { id: "linkedin", label: "LinkedIn", href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN ?? "" },
    { id: "facebook", label: "Facebook", href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK ?? "" },
    { id: "instagram", label: "Instagram", href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM ?? "" },
    { id: "x", label: "X", href: process.env.NEXT_PUBLIC_SOCIAL_X ?? "" }
  ]
  return all.filter((social) => social.href.trim().startsWith("http"))
}
