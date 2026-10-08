export type Lang = "en" | "fr"

/**
 * Landing page copy. French is a first draft for a native speaker to review.
 * Nothing here claims more than the shop does: live stock, real brands, quotes
 * and company approvals.
 */
const copy = {
  en: {
    metaTitle: "Raaga | Spare Parts from Mines & Plants in West Africa",
    metaDescription:
      "Buy and sell surplus spare parts held at mines and plants across West Africa. Search by part number, brand or machine: closer than an overseas order.",
    storeHeading: "All parts",
    storeTitle: "All Spare Parts | Raaga",
    storeDescription:
      "Browse every part in stock. Search by part number, brand or category; prices are shown before tax.",
    siteName: "Raaga",
    ogLocale: "en_US",
    sellLink: "Have surplus parts? Sell them",
    localTitle: "Why source locally",
    localPoints: [
      { title: "Already in the region", body: "The parts are held at mines and plants across West Africa, not on a ship from overseas." },
      { title: "Shorter lead times", body: "Stock that is nearby reaches you sooner than an overseas order." },
      { title: "Less freight and logistics", body: "A shorter journey means fewer legs to arrange and less to pay." },
      { title: "Idle stock becomes cash", body: "Mines and plants with surplus parts can sell them instead of storing them." },
    ],
    localLegsLabelOverseas: "Overseas order",
    localLegsLabelLocal: "From a site in the region",
    localLegsOverseas: ["Supplier", "Shipping", "Port", "Customs", "Your site"],
    localLegsLocal: ["Nearby site", "Your site"],
    localLegsCaption: "An illustration of the legs involved, not a measurement.",
    bandPlateLabel: "PART NO.",
    bandBuyTitle: "Need a part?",
    bandBuyBody: "Search the catalogue. Add it to your cart, or request a quote when no price is listed.",
    bandBuySearch: "Search parts",
    bandBuyAccount: "Log in or create an account",
    bandSellTitle: "Have surplus parts?",
    bandSellSteps: [
      "Send us your parts list as a sheet.",
      "We list it on the shop.",
      "We arrange payment with you.",
    ],
    bandSellButton: "Sell your surplus",
    bandPhotoAlt: "An excavator loading a dump truck at a rocky mine site",
    heroLine1: "Find the part.",
    heroLine2: "Already in the region.",
    heroSub:
      "Get the parts you need, faster.",
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
    footerTagline: "Spare parts held at mines and plants in West Africa.",
    footerCategories: "Categories",
    footerSeeAll: "See all parts",
    footerBrands: "Brands",
    footerFollow: "Follow us",
    footerCompany: "Company",
    footerSupport: "Support",
    footerAllParts: "All parts",
    footerHow: "How buying works",
    footerBrandsLink: "Browse by brand",
    footerContact: "Contact us",
    footerMore: "More",
    footerAbout: "About Raaga",
    footerTerms: "Terms of sale",
    footerPrivacy: "Privacy policy",
    footerSuppliers: "Sell your surplus",
    footerLogin: "Log in or create an account",
    footerQuotes: "My quotes",
    footerOrders: "My orders",
    footerRights: "All rights reserved.",
  },
  fr: {
    metaTitle: "Raaga | Pièces détachées en Afrique de l'Ouest",
    metaDescription:
      "Achetez et vendez des pièces détachées excédentaires disponibles dans des mines et sites industriels d'Afrique de l'Ouest. Recherchez par référence, marque ou machine.",
    storeHeading: "Toutes les pièces",
    storeTitle: "Toutes les pièces détachées | Raaga",
    storeDescription:
      "Parcourez toutes les pièces en stock. Recherchez par référence, marque ou catégorie ; les prix sont affichés hors taxes.",
    siteName: "Raaga",
    ogLocale: "fr_FR",
    sellLink: "Des pièces en surplus ? Vendez-les",
    localTitle: "Pourquoi acheter localement",
    localPoints: [
      { title: "Déjà dans la région", body: "Les pièces sont détenues dans des mines et sites industriels d'Afrique de l'Ouest, pas sur un navire venu d'ailleurs." },
      { title: "Des délais plus courts", body: "Un stock proche vous parvient plus vite qu'une commande à l'étranger." },
      { title: "Moins de fret et de logistique", body: "Un trajet plus court, c'est moins d'étapes à organiser et moins à payer." },
      { title: "Le stock dormant devient de l'argent", body: "Les mines et sites avec des pièces en surplus peuvent les vendre au lieu de les stocker." },
    ],
    localLegsLabelOverseas: "Commande à l'étranger",
    localLegsLabelLocal: "Depuis un site de la région",
    localLegsOverseas: ["Fournisseur", "Transport", "Port", "Douane", "Votre site"],
    localLegsLocal: ["Site proche", "Votre site"],
    localLegsCaption: "Une illustration des étapes, pas une mesure.",
    bandPlateLabel: "RÉF.",
    bandBuyTitle: "Besoin d'une pièce ?",
    bandBuyBody: "Parcourez le catalogue. Ajoutez-la au panier, ou demandez un devis quand aucun prix n'est affiché.",
    bandBuySearch: "Rechercher des pièces",
    bandBuyAccount: "Se connecter ou créer un compte",
    bandSellTitle: "Des pièces en surplus ?",
    bandSellSteps: [
      "Envoyez-nous votre liste de pièces sous forme de fichier.",
      "Nous la mettons en ligne sur la boutique.",
      "Nous convenons du paiement avec vous.",
    ],
    bandSellButton: "Vendre vos surplus",
    bandPhotoAlt: "Une pelleteuse chargeant un tombereau sur un site minier rocailleux",
    heroLine1: "Trouvez la pièce.",
    heroLine2: "Déjà dans la région.",
    heroSub:
      "Obtenez les pièces dont vous avez besoin, plus vite.",
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
    footerTagline: "Pièces détachées disponibles dans des mines et sites industriels d'Afrique de l'Ouest.",
    footerCategories: "Catégories",
    footerSeeAll: "Voir toutes les pièces",
    footerBrands: "Marques",
    footerFollow: "Suivez-nous",
    footerCompany: "Société",
    footerSupport: "Assistance",
    footerAllParts: "Toutes les pièces",
    footerHow: "Comment acheter",
    footerBrandsLink: "Parcourir par marque",
    footerContact: "Nous contacter",
    footerMore: "Plus",
    footerAbout: "À propos de Raaga",
    footerTerms: "Conditions de vente",
    footerPrivacy: "Politique de confidentialité",
    footerSuppliers: "Vendre vos surplus",
    footerLogin: "Se connecter ou créer un compte",
    footerQuotes: "Mes devis",
    footerOrders: "Mes commandes",
    footerRights: "Tous droits réservés.",
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
