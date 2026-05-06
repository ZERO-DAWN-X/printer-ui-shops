export type BillingCurrency = "lkr" | "usd";

export type ShopDetails = {
  /** Main shop name — T1–T4, T6–T8 receipts */
  name: string;
  /** Bakery title on Type 5 only; if empty, falls back to `name` */
  bakeryShopName: string;
  address: string;
  phone: string;
  thankYouMessage: string;
  /** Opening hours — printed under Tel on Type 5 bakery layout only */
  openingHours: string;
  /** Extra line (e.g. registration, specialties) — Type 5 bakery layout only */
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
