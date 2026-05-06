import type { BillingCurrency, CartItem } from "@/types/billing";

/** VAT line on billing demo — keep in sync with `features/billing/billing-app` */
export const BILLING_TAX_RATE = 0;

export const calculateSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.qty * item.price, 0);

export function formatMoneyTotal(amount: number, currency: BillingCurrency): string {
  const fixed = amount.toFixed(2);
  // Thin space (U+2009) keeps "\u0dbb\u0dd4." visually separated from amount without breaking line.
  return currency === "usd" ? `$${fixed}` : `\u0dbb\u0dd4.\u2009${fixed}`;
}

export const generateReceiptFromSeed = (seed: string): string => {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 900000;
  }

  return (100000 + hash).toString();
};
