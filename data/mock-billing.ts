import type { CartItem, ShopDetails } from "@/types/billing";

export const DEFAULT_SHOP_DETAILS: ShopDetails = {
  name: "සඳලු ස්ටෝර්ස්",
  address: "123, Main Street, Colombo",
  phone: "071 234 5678",
  thankYouMessage: "ස්තූතියි, නැවත එන්න!",
};

export const DEFAULT_ITEMS: CartItem[] = [
  { id: 1, name: "කිරි පැකට්", qty: 2, price: 150 },
  { id: 2, name: "සබන්", qty: 3, price: 80 },
  { id: 3, name: "බිත්තර", qty: 10, price: 65 },
  { id: 4, name: "සැමන් ටින්", qty: 1, price: 550 },
  { id: 5, name: "පිටි 1kg", qty: 2, price: 220 },
  { id: 6, name: "සම්බා හාල් 1kg", qty: 5, price: 240 },
  { id: 7, name: "තේ කොළ 100g", qty: 1, price: 180 },
];
