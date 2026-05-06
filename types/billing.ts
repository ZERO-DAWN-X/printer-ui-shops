export type BillingCurrency = "lkr" | "usd";

export type ShopDetails = {
  /** Main shop name — T1–T4, T7–T8 receipts */
  name: string;
  /** Bakery title on Type 5 only; if empty, falls back to `name` */
  bakeryShopName: string;
  /** PC shop title on Type 6 only; if empty, falls back to `name` */
  pcShopName: string;
  /** Services / tagline — Type 6 header only */
  pcShopNote: string;
  address: string;
  phone: string;
  thankYouMessage: string;
  /** Opening hours — Type 5 & Type 6 headers when non-empty */
  openingHours: string;
  /** Extra line — Type 5 bakery layout only */
  bakeryNote: string;
};

export type CartItem = {
  id: number;
  name: string;
  qty: number;
  price: number;
};

export type NewItemForm = {
  name: string;
  qty: number;
  price: string;
};
