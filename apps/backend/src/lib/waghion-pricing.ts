// Pre-tax selling price for a Waghion item.
// The sheet's unit price is TTC (18% VAT included). Add the markup, strip the
// VAT, then round so prices look deliberate. Tax is added back at checkout.
export const MARKUP_PERCENT = 20;
export const VAT_PERCENT = 18;
export const XOF_PER_USD = 600;

// Pre-tax price: nearest 500 XOF (nearest 1,000 from 100,000), never below 500.
// A multiple of 500 plus 18% or 19% VAT is a multiple of 5 (500 -> 590 / 595), so
// the after-tax total also lands on the nearest 5 F.
export function roundXof(amount: number): number {
  const step = amount < 100000 ? 500 : 1000;
  return Math.max(500, Math.round(amount / step) * step);
}

export function waghionPrices(sheetUnitPriceXof: number) {
  const preTax =
    (sheetUnitPriceXof * (1 + MARKUP_PERCENT / 100)) / (1 + VAT_PERCENT / 100);
  const xof = roundXof(preTax);
  const usd = Math.round((xof / XOF_PER_USD) * 100) / 100;
  return { xof, usd };
}
