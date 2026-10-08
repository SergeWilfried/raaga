/** Shown wherever a part has no brand, so the line is never left blank. */
export const NO_BRAND_LABEL = "NO NAME"

export const brandLabel = (brand?: string | null): string =>
  brand?.trim() || NO_BRAND_LABEL
