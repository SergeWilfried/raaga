export type Lang = "en" | "fr"

/**
 * Landing page copy. French is a first draft for a native speaker to review.
 * Nothing here claims more than the shop does: live stock, real brands, quotes
 * and company approvals.
 */
const copy = {
  en: {
    metaTitle: "Raaga | Mining spare parts in West Africa",
    metaDescription:
      "Search mining spare parts held in West Africa by part number, brand or machine. See stock and pre-tax prices, or request a quote.",
    heroLine1: "Find the part.",
    heroLine2: "See the stock.",
    heroSub:
      "Mining spare parts held in West Africa. Search by part number, brand or machine.",
    searchLabel: "Search by part number, name or brand",
    searchPlaceholder: "Part number, name or brand",
    searchButton: "Search",
    tryLabel: "Try",
    examples: ["16668", "Sandvik seal kit", "Perkins filter"],
    heroAlt:
      "Machinery working a quarry seen from above, with tracks pressed into the gravel",
    shelfTitle: "On the shelf now",
    shelfAll: "See all parts",
    shelfScroll: "Parts on the shelf, scroll sideways for more",
    brandsTitle: "Browse by brand",
    parts: (n: number) => `${n} ${n === 1 ? "part" : "parts"}`,
    howTitle: "How buying works",
    steps: [
      {
        title: "Find the part",
        body: "Search by part number, brand or machine. Stock and the pre-tax price show on every result.",
      },
      {
        title: "Add it to your cart, or ask for a quote",
        body: "A part with no listed price goes to a quote: you state the quantity, we price it, you accept or decline.",
      },
      {
        title: "Order within your company's rules",
        body: "If your company requires approval, it's requested before the order is placed.",
      },
    ],
    quoteTitle: "No price listed? Ask for a quote.",
    quoteBody:
      "Pick a part, choose a quantity and request a quote from your account. You get a price you can accept or decline.",
    quoteButton: "Log in or create an account",
  },
  fr: {
    metaTitle: "Raaga | Pièces détachées minières en Afrique de l'Ouest",
    metaDescription:
      "Recherchez des pièces détachées minières disponibles en Afrique de l'Ouest par référence, marque ou machine. Stock et prix HT affichés, ou demandez un devis.",
    heroLine1: "Trouvez la pièce.",
    heroLine2: "Voyez le stock.",
    heroSub:
      "Pièces détachées minières disponibles en Afrique de l'Ouest. Recherchez par référence, marque ou machine.",
    searchLabel: "Rechercher par référence, nom ou marque",
    searchPlaceholder: "Référence, nom ou marque",
    searchButton: "Rechercher",
    tryLabel: "Essayez",
    examples: ["16668", "Sandvik seal kit", "Perkins filter"],
    heroAlt:
      "Engins de chantier au travail dans une carrière, vus du ciel, avec des traces de chenilles dans le gravier",
    shelfTitle: "En rayon maintenant",
    shelfAll: "Voir toutes les pièces",
    shelfScroll: "Pièces en rayon, faites défiler latéralement pour en voir plus",
    brandsTitle: "Parcourir par marque",
    parts: (n: number) => `${n} ${n === 1 ? "pièce" : "pièces"}`,
    howTitle: "Comment acheter",
    steps: [
      {
        title: "Trouvez la pièce",
        body: "Recherchez par référence, marque ou machine. Le stock et le prix HT figurent sur chaque résultat.",
      },
      {
        title: "Ajoutez-la au panier, ou demandez un devis",
        body: "Une pièce sans prix affiché passe par un devis : vous indiquez la quantité, nous chiffrons, vous acceptez ou refusez.",
      },
      {
        title: "Commandez selon les règles de votre société",
        body: "Si votre société exige une validation, elle est demandée avant la passation de la commande.",
      },
    ],
    quoteTitle: "Pas de prix affiché ? Demandez un devis.",
    quoteBody:
      "Choisissez une pièce, une quantité et demandez un devis depuis votre compte. Vous recevez un prix que vous pouvez accepter ou refuser.",
    quoteButton: "Se connecter ou créer un compte",
  },
} as const

export const getLandingCopy = (lang: Lang) => copy[lang]

/** `?lang=` wins; otherwise the browser's preferred language; English by default. */
export const resolveLang = (
  queryLang: string | undefined,
  acceptLanguage: string | null
): Lang => {
  if (queryLang === "fr" || queryLang === "en") return queryLang
  const first = acceptLanguage?.split(",")[0]?.trim().toLowerCase() ?? ""
  return first.startsWith("fr") ? "fr" : "en"
}
