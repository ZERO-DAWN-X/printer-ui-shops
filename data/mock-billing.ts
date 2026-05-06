import type { CartItem, ShopDetails } from "@/types/billing";

/** Sinhala / local demo — used when Sinhala is selected */
export const DEFAULT_SHOP_DETAILS: ShopDetails = {
  name: "සඳලු ස්ටෝර්ස්",
  bakeryShopName: "සාදගිරි බේකරිය",
  address: "123, Main Street, Colombo",
  phone: "071 234 5678",
  thankYouMessage: "ස්තූතියි, නැවත එන්න!",
  openingHours: "Daily 6–9 PM · Sat 7–10 PM",
  bakeryNote: "බේකරි හා කේක් · විශේෂ ඇණවුම් · ගෙදරටම බෙදා හැරීම",
};

export const DEFAULT_ITEMS: CartItem[] = [
  { id: 1, name: "කිරි පැකට්", qty: 2, price: 150 },
  { id: 2, name: "සබන්", qty: 3, price: 80 },
  { id: 3, name: "බිත්තර", qty: 10, price: 65 },
  { id: 4, name: "සැමන් ටින්", qty: 1, price: 550 },
];

/** English / overseas-style grocer demo — used when English is selected */
export const FOREIGN_SHOP_DETAILS: ShopDetails = {
  name: "Zero market",
  bakeryShopName: "Zero market Bakery",
  address: "450 N Michigan Ave, Chicago, IL 60611",
  phone: "+1 (312) 555-0198",
  thankYouMessage: "Thanks for shopping — we appreciate your visit!",
  openingHours: "Daily 7AM–9PM · Sat 8AM–10PM",
  bakeryNote: "Artisan breads · Cakes · Custom orders · Catering",
};

export const FOREIGN_SHOP_ITEMS: CartItem[] = [
  { id: 101, name: "Milk", qty: 1, price: 6.79 },
  { id: 102, name: "Eggs", qty: 2, price: 4.29 },
  { id: 103, name: "Bread", qty: 1, price: 5.49 },
  { id: 104, name: "Almond butter", qty: 2, price: 8.99 },
];
