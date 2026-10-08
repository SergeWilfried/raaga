// Brands recognised in item names. Names often glue the brand to a part number
// ("BG00646595SANDVIK", "RING, LOCATING, FRB14/215SKF"), so a brand matches
// whenever it isn't preceded or followed by another letter.
// Add new brands here and re-run extract-brands.ts.
const BRANDS: [pattern: string, label: string][] = [
  ["SANDVIK", "Sandvik"],
  ["TEREX", "Terex"],
  ["EPIROC", "Epiroc"],
  ["CATERPILLAR", "Caterpillar"],
  ["CAT", "Caterpillar"],
  ["PERKINS", "Perkins"],
  ["SKF", "SKF"],
  ["FLEETGUARD", "Fleetguard"],
  ["LEADECO", "Leadeco"],
  ["METSO", "Metso"],
  ["SIRENCO", "Sirenco"],
];

export function extractBrand(name: string): string | null {
  const upper = name.toUpperCase();
  for (const [pattern, label] of BRANDS) {
    if (new RegExp(`(?<![A-Z])${pattern}(?![A-Z])`).test(upper)) {
      return label;
    }
  }
  return null;
}

/**
 * One spelling per brand: "CATERPILLAR" and "Caterpillar" must not become two
 * filter values. Short names stay upper case (SKF, NSK), longer ones are
 * title-cased word by word ("ATLAS COPCO" -> "Atlas Copco").
 */
export function normalizeBrand(brand: string | null | undefined): string | null {
  const trimmed = brand?.trim();
  if (!trimmed || trimmed === "#") return null;
  return trimmed
    .split(/\s+/)
    .map((word) =>
      word.length <= 3
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
}
