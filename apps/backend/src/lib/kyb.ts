// Country-specific names for the two business-identity numbers collected for
// KYB. Most OHADA states (WAEMU, Guinea) use the RCCM for registration; the
// tax-ID name differs by country. Keep in sync with storefront/src/lib/kyb.ts.

export type KybLabels = {
  registration: { en: string; fr: string }
  taxId: { en: string; fr: string }
}

const RCCM = {
  en: "RCCM (Trade and Personal Property Credit Register)",
  fr: "RCCM (Registre du Commerce et du Crédit Mobilier)",
}

const ifu = {
  en: "IFU (Unique Tax Identification Number)",
  fr: "IFU (Identifiant Financier Unique)",
}
const nif = {
  en: "NIF (Tax Identification Number)",
  fr: "NIF (Numéro d'Identification Fiscale)",
}

const BY_COUNTRY: Record<string, KybLabels> = {
  BF: { registration: RCCM, taxId: ifu },
  BJ: { registration: RCCM, taxId: ifu },
  TG: { registration: RCCM, taxId: nif },
  NE: { registration: RCCM, taxId: nif },
  ML: { registration: RCCM, taxId: nif },
  GW: { registration: RCCM, taxId: nif },
  GN: { registration: RCCM, taxId: nif },
  SN: {
    registration: RCCM,
    taxId: {
      en: "NINEA (National Business Identification Number)",
      fr: "NINEA (Numéro d'Identification Nationale des Entreprises et Associations)",
    },
  },
  CI: {
    registration: RCCM,
    taxId: {
      en: "NCC (Taxpayer Account Number)",
      fr: "NCC (Numéro de Compte Contribuable)",
    },
  },
  GH: {
    registration: {
      en: "Registrar of Companies registration number",
      fr: "Numéro d'immatriculation (Registrar of Companies)",
    },
    taxId: { en: "TIN (Tax Identification Number)", fr: "TIN (Numéro d'Identification Fiscale)" },
  },
  NG: {
    registration: {
      en: "CAC registration number (RC/BN)",
      fr: "Numéro d'immatriculation CAC (RC/BN)",
    },
    taxId: { en: "TIN (Tax Identification Number)", fr: "TIN (Numéro d'Identification Fiscale)" },
  },
}

const FALLBACK: KybLabels = {
  registration: {
    en: "Business registration number (RCCM or equivalent)",
    fr: "Numéro d'immatriculation (RCCM ou équivalent)",
  },
  taxId: {
    en: "Tax ID (IFU or equivalent)",
    fr: "Identifiant fiscal (IFU ou équivalent)",
  },
}

// Country names as they appear in region data, for companies whose country
// was saved as a display name rather than an ISO code.
const NAME_TO_ISO: Record<string, string> = {
  "burkina faso": "BF",
  benin: "BJ",
  bénin: "BJ",
  togo: "TG",
  niger: "NE",
  mali: "ML",
  "guinea-bissau": "GW",
  "guinée-bissau": "GW",
  guinea: "GN",
  guinée: "GN",
  senegal: "SN",
  sénégal: "SN",
  "côte d'ivoire": "CI",
  "cote d'ivoire": "CI",
  "ivory coast": "CI",
  ghana: "GH",
  nigeria: "NG",
}

export function kybLabels(country: string | null | undefined): KybLabels {
  const key = (country ?? "").trim()
  const iso = key.length === 2 ? key.toUpperCase() : NAME_TO_ISO[key.toLowerCase()]
  return (iso && BY_COUNTRY[iso]) || FALLBACK
}
