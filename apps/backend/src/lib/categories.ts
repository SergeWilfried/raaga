/**
 * One customer-facing category list shared by every supplier. Each supplier's
 * own codes or types are mapped onto it, so the same kind of part lands in the
 * same category whoever holds it. Supplier names never appear here.
 */

export const CATEGORIES = [
  "Mining fleet and drill spares",
  "Crusher, mill and plant spares",
  "Electrical and power generation",
  "Fasteners and hardware",
  "Bearings and bushes",
  "Pipes, hoses and fittings",
  "Steel and metal stock",
  "Lubricants and greases",
  "Drilling consumables",
  "Ground engaging tools",
  "Liners",
  "Tires",
  "Conveyor belts",
  "PPE and safety",
  "Chemicals and reagents",
  "Workshop and general supplies",
  "Other spares",
] as const;

export type CategoryName = (typeof CATEGORIES)[number];

// Waghion sheet: four-letter group code. SP = equipment spares, CS/CO =
// consumables and stores. A few codes are best guesses (SPMN, SPPR, CPPL,
// COML, STPM); confirm with the supplier.
export const WAGHION_CATEGORY: Record<string, CategoryName> = {
  SPDR: "Mining fleet and drill spares",
  CSDR: "Mining fleet and drill spares",
  SPOT: "Mining fleet and drill spares",
  SPMN: "Crusher, mill and plant spares",
  SPCV: "Crusher, mill and plant spares",
  SPML: "Crusher, mill and plant spares",
  SPPP: "Crusher, mill and plant spares",
  CPPL: "Crusher, mill and plant spares",
  CSEC: "Crusher, mill and plant spares",
  ECCS: "Crusher, mill and plant spares",
  CSMT: "Crusher, mill and plant spares",
  ELCS: "Electrical and power generation",
  CSGN: "Electrical and power generation",
  HDFS: "Fasteners and hardware",
  SPPR: "Fasteners and hardware",
  BBWG: "Bearings and bushes",
  PPFF: "Pipes, hoses and fittings",
  CSST: "Steel and metal stock",
  RELB: "Lubricants and greases",
  CSOT: "Workshop and general supplies",
  COOT: "Workshop and general supplies",
  COML: "Workshop and general supplies",
  STPM: "Workshop and general supplies",
};

// Nordgold sheet: the "Type" column.
export const NORDGOLD_CATEGORY: Record<string, CategoryName> = {
  "Mining fleet spares": "Mining fleet and drill spares",
  "Plant Spares": "Crusher, mill and plant spares",
  "Power generation and electrical spares": "Electrical and power generation",
  Metal: "Steel and metal stock",
  Lubes: "Lubricants and greases",
  "Drilling Consumables": "Drilling consumables",
  "Ground Engaging Tools": "Ground engaging tools",
  Lining: "Liners",
  Tires: "Tires",
  "Conveyor belt": "Conveyor belts",
  PPE: "PPE and safety",
  "Other reagents": "Chemicals and reagents",
  CEMENT: "Chemicals and reagents",
  "Other spares": "Other spares",
  Others: "Other spares",
};

export const categoryFor = (
  supplier: "waghion" | "nordgold",
  raw: string | null | undefined
): CategoryName | null => {
  if (!raw) return null;
  const map = supplier === "waghion" ? WAGHION_CATEGORY : NORDGOLD_CATEGORY;
  return map[raw] ?? null;
};
