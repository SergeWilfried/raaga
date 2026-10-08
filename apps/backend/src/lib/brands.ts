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
