export type BillingCurrency = "lkr" | "usd";

export type ShopDetails = {
  name: string;
  address: string;
  phone: string;
  thankYouMessage: string;
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
