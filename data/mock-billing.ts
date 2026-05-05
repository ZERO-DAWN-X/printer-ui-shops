import type { CartItem, ShopDetails } from "@/types/billing";

/** Sinhala / local bakery demo — used when Sinhala is selected */
export const DEFAULT_SHOP_DETAILS: ShopDetails = {
  name: "සඳලු ස්ටෝර්ස්",
  address: "123, Main Street, Colombo",
  phone: "071 234 5678",
  thankYouMessage: "ස්තූතියි, නැවත එන්න!",
};

export const DEFAULT_ITEMS: CartItem[] = [
  { id: 1, name: "කිරි පැකට් (Fresh Milk Full Cream 400ml)", qty: 2, price: 150 },
  { id: 2, name: "සබන්", qty: 3, price: 80 },
  { id: 3, name: "බිත්තර (Farm Fresh Brown Eggs Large Size)", qty: 10, price: 65 },
  { id: 4, name: "සැමන් ටින්", qty: 1, price: 550 },
];

/** English / overseas-style grocer demo — used when English is selected */
export const FOREIGN_SHOP_DETAILS: ShopDetails = {
  name: "Brookdale Market",
  address: "450 N Michigan Ave, Chicago, IL 60611",
  phone: "+1 (312) 555-0198",
  thankYouMessage: "Thanks for shopping — we appreciate your visit!",
};

export const FOREIGN_SHOP_ITEMS: CartItem[] = [
  { id: 101, name: "Organic Whole Milk (1 gal)", qty: 1, price: 6.79 },
  { id: 102, name: "Free-range Eggs (dozen)", qty: 2, price: 4.29 },
  { id: 103, name: "Artisan Sourdough Loaf", qty: 1, price: 5.49 },
  { id: 104, name: "Almond Butter (340 g)", qty: 2, price: 8.99 },
];
