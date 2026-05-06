export type BillingCurrency = "lkr" | "usd";

export type ShopDetails = {
  /** Main shop name — T1–T4, T8 receipts */
  name: string;
  /** Bakery title on Type 5 only; if empty, falls back to `name` */
  bakeryShopName: string;
  /** PC shop title on Type 6 only; if empty, falls back to `name` */
  pcShopName: string;
  /** Services / tagline — Type 6 header only */
  pcShopNote: string;
  /** Restaurant title on Type 7 only; if empty, falls back to `name` */
  restaurantShopName: string;
  /** Cuisines / tagline — Type 7 header only */
  restaurantNote: string;
  address: string;
  phone: string;
  thankYouMessage: string;
  /** Opening hours — Type 5–7 headers when non-empty */
  openingHours: string;
  /** Extra line — Type 5 bakery layout only */
  bakeryNote: string;
};

export type CartItem = {
  id: number;
  name: string;
  qty: number;
  price: number;
  /** Original listed price; falls back to `price` when omitted. Used by T8 to show savings. */
  listedPrice?: number;
};

export type NewItemForm = {
  name: string;
  qty: number;
  price: string;
};
