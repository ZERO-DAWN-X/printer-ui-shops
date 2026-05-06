import {
  DEFAULT_PC_PREVIEW_ITEMS,
  DEFAULT_RESTAURANT_PREVIEW_ITEMS,
  FOREIGN_PC_PREVIEW_ITEMS,
  FOREIGN_RESTAURANT_PREVIEW_ITEMS,
} from "@/data/mock-billing";
import type { BillingCurrency, CartItem } from "@/types/billing";
import { BILLING_TAX_RATE, calculateSubtotal } from "@/utils/billing";

/** Type 6 (PC) / Type 7 (restaurant) — same cart source as the receipt grid previews */
export type ThemedReceiptKind = "pc" | "restaurant";

const cloneCart = (rows: CartItem[]): CartItem[] => rows.map((row) => ({ ...row }));

export function cartForThemedReceipt(kind: ThemedReceiptKind, locale: "en" | "si"): CartItem[] {
  if (kind === "pc") {
    return cloneCart(locale === "en" ? FOREIGN_PC_PREVIEW_ITEMS : DEFAULT_PC_PREVIEW_ITEMS);
  }
  return cloneCart(locale === "en" ? FOREIGN_RESTAURANT_PREVIEW_ITEMS : DEFAULT_RESTAURANT_PREVIEW_ITEMS);
}

export function totalsForReceiptCart(rows: CartItem[]) {
  const subTotal = calculateSubtotal(rows);
  const tax = subTotal * BILLING_TAX_RATE;
  return { subTotal, tax, total: subTotal + tax };
}

/** Cash tender shown on themed T6/T7 — matches receipt preview buffer */
export function tenderForThemedTotal(
  currency: BillingCurrency,
  total: number,
  typedCashReceived: number,
): number {
  const buffer = currency === "usd" ? 15 : 2000;
  return Math.max(typedCashReceived, total + buffer);
}
