import type { Lang } from "./landing-copy"

export type PageKey = "about" | "contact" | "suppliers" | "terms" | "privacy"

type Section = { heading: string; body: string[] }
type PageCopy = { title: string; description: string; intro: string; sections: Section[] }

/**
 * Plain information pages. Only facts about how the shop works are stated.
 * Terms and privacy are generic drafts: a lawyer should review them and add the
 * legal entity, governing law and data-protection details before launch.
 * French is a first draft for a native speaker to review.
 */
const pages: Record<PageKey, Record<Lang, PageCopy>> = {
  about: {
    en: {
      title: "About Raaga",
      description: "Raaga is an online catalogue of mining spare parts held in West Africa.",
      intro: "Raaga is an online catalogue of mining spare parts held in West Africa.",
      sections: [
        {
          heading: "What you can do here",
          body: [
            "Search by part number, brand or machine, and see the stock held.",
            "Prices are shown before tax. VAT is calculated in your cart for your delivery country.",
            "Parts without a listed price are quoted: choose a quantity and request a quote from your account.",
          ],
        },
        {
          heading: "Buying for a company",
          body: [
            "Orders are placed from a company account. A company can set spending limits and require approval before an order is placed.",
          ],
        },
      ],
    },
    fr: {
      title: "À propos de Raaga",
      description: "Raaga est un catalogue en ligne de pièces détachées minières disponibles en Afrique de l'Ouest.",
      intro: "Raaga est un catalogue en ligne de pièces détachées minières disponibles en Afrique de l'Ouest.",
      sections: [
        {
          heading: "Ce que vous pouvez faire ici",
          body: [
            "Recherchez par référence, marque ou machine, et consultez le stock disponible.",
            "Les prix sont affichés hors taxes. La TVA est calculée dans votre panier selon le pays de livraison.",
            "Les pièces sans prix affiché sont sur devis : choisissez une quantité et demandez un devis depuis votre compte.",
          ],
        },
        {
          heading: "Acheter pour une société",
          body: [
            "Les commandes se passent depuis un compte société. Une société peut fixer des plafonds de dépenses et exiger une validation avant la passation d'une commande.",
          ],
        },
      ],
    },
  },
  contact: {
    en: {
      title: "Contact us",
      description: "Reach us about a part, a quote or an order.",
      intro: "Reach us about a part, a quote or an order.",
      sections: [
        {
          heading: "Before you write",
          body: [
            "Include the part number and the quantity you need.",
            "To get a price for a part that has none listed, request a quote from the part's page.",
          ],
        },
      ],
    },
    fr: {
      title: "Nous contacter",
      description: "Contactez-nous au sujet d'une pièce, d'un devis ou d'une commande.",
      intro: "Contactez-nous au sujet d'une pièce, d'un devis ou d'une commande.",
      sections: [
        {
          heading: "Avant de nous écrire",
          body: [
            "Indiquez la référence de la pièce et la quantité souhaitée.",
            "Pour obtenir le prix d'une pièce sans prix affiché, demandez un devis depuis la page de la pièce.",
          ],
        },
      ],
    },
  },
  suppliers: {
    en: {
      title: "For suppliers",
      description: "Have surplus or slow-moving mining spare parts to sell?",
      intro: "Have surplus or slow-moving mining spare parts to sell?",
      sections: [
        {
          heading: "What to send us",
          body: [
            "For each item: part number, description, brand, quantity and condition.",
            "Where the stock is held.",
          ],
        },
        {
          heading: "What happens next",
          body: ["Send us your list and we will get back to you about how it could be listed."],
        },
      ],
    },
    fr: {
      title: "Pour les fournisseurs",
      description: "Vous avez des pièces détachées minières excédentaires ou à rotation lente à vendre ?",
      intro: "Vous avez des pièces détachées minières excédentaires ou à rotation lente à vendre ?",
      sections: [
        {
          heading: "Ce qu'il faut nous envoyer",
          body: [
            "Pour chaque article : référence, description, marque, quantité et état.",
            "Le lieu où se trouve le stock.",
          ],
        },
        {
          heading: "La suite",
          body: ["Envoyez-nous votre liste et nous reviendrons vers vous sur la façon de la référencer."],
        },
      ],
    },
  },
  terms: {
    en: {
      title: "Terms of sale",
      description: "The terms that apply to orders placed through this store.",
      intro: "These terms apply to orders placed through this store.",
      sections: [
        { heading: "Prices and tax", body: ["Prices are shown in the store currency before VAT. VAT is calculated at checkout from the delivery country."] },
        { heading: "Stock and availability", body: ["Stock is shown as available when you view a part. It can change before an order is confirmed."] },
        { heading: "Quotes", body: ["A quote is a price offer. It applies only once you accept it in your account."] },
        { heading: "Orders and approval", body: ["Orders are placed from a company account. A company may require approval before an order is placed."] },
        { heading: "Delivery and payment", body: ["Delivery and payment options are shown at checkout."] },
        { heading: "Your rights", body: ["Nothing in these terms limits any right you have by law."] },
      ],
    },
    fr: {
      title: "Conditions de vente",
      description: "Les conditions applicables aux commandes passées sur cette boutique.",
      intro: "Ces conditions s'appliquent aux commandes passées sur cette boutique.",
      sections: [
        { heading: "Prix et taxes", body: ["Les prix sont affichés dans la devise de la boutique, hors TVA. La TVA est calculée au paiement selon le pays de livraison."] },
        { heading: "Stock et disponibilité", body: ["Le stock est indiqué comme disponible au moment où vous consultez une pièce. Il peut changer avant la confirmation d'une commande."] },
        { heading: "Devis", body: ["Un devis est une offre de prix. Il ne s'applique qu'une fois accepté dans votre compte."] },
        { heading: "Commandes et validation", body: ["Les commandes se passent depuis un compte société. Une société peut exiger une validation avant la passation d'une commande."] },
        { heading: "Livraison et paiement", body: ["Les options de livraison et de paiement sont affichées au moment du paiement."] },
        { heading: "Vos droits", body: ["Aucune disposition de ces conditions ne limite les droits que vous tenez de la loi."] },
      ],
    },
  },
  privacy: {
    en: {
      title: "Privacy policy",
      description: "What personal data this store collects and why.",
      intro: "This page explains what personal data this store collects and why.",
      sections: [
        { heading: "What we collect", body: ["Account details (name, email, company), your orders and quotes, and messages you send us."] },
        { heading: "Why", body: ["To run your account, process orders and quotes, and answer you."] },
        { heading: "Sharing", body: ["We do not sell personal data. We share it only with service providers needed to run the store, such as hosting and payment."] },
        { heading: "Cookies and statistics", body: ["The store uses cookies needed for sign-in and your cart. It also collects anonymous usage statistics to improve the store."] },
        { heading: "Your choices", body: ["Contact us to see, correct or delete your data."] },
      ],
    },
    fr: {
      title: "Politique de confidentialité",
      description: "Les données personnelles collectées par cette boutique et pourquoi.",
      intro: "Cette page explique quelles données personnelles cette boutique collecte et pourquoi.",
      sections: [
        { heading: "Ce que nous collectons", body: ["Les informations de compte (nom, e-mail, société), vos commandes et devis, et les messages que vous nous envoyez."] },
        { heading: "Pourquoi", body: ["Pour gérer votre compte, traiter les commandes et devis, et vous répondre."] },
        { heading: "Partage", body: ["Nous ne vendons pas de données personnelles. Nous les partageons uniquement avec les prestataires nécessaires au fonctionnement de la boutique, comme l'hébergement et le paiement."] },
        { heading: "Cookies et statistiques", body: ["La boutique utilise les cookies nécessaires à la connexion et au panier. Elle collecte aussi des statistiques d'usage anonymes pour l'améliorer."] },
        { heading: "Vos choix", body: ["Contactez-nous pour consulter, corriger ou supprimer vos données."] },
      ],
    },
  },
}

export const getPageCopy = (key: PageKey, lang: Lang) => pages[key][lang]

export const draftNotice = {
  en: "Draft: this text is pending legal review.",
  fr: "Brouillon : ce texte est en attente de relecture juridique.",
} as const
