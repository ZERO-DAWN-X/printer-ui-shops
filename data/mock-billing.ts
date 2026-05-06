import type { CartItem, ShopDetails } from "@/types/billing";

/** Sinhala / local demo — used when Sinhala is selected */
export const DEFAULT_SHOP_DETAILS: ShopDetails = {
  name: "සඳලු ස්ටෝර්ස්",
  bakeryShopName: "සදගිරි බේකරිය",
  pcShopName: "මෝඩන් බයිට්ස් පීසී",
  pcShopNote: "ලැප්ටොප් · ගේමින් · ගොඩනැගීම් · අලුත්වැඩියා · දෝෂ හඳුනා ගැනීම · ගෙදරට බෙදා හැරීම",
  address: "123, Main Street, Colombo",
  phone: "071 234 5678",
  thankYouMessage: "ස්තූතියි, නැවත එන්න!",
  openingHours: "",
  bakeryNote: "බේකරි හා කේක් · විශේෂ ඇණවුම් · ගෙදරටම බෙදා හැරීම",
};

export const DEFAULT_ITEMS: CartItem[] = [
  { id: 1, name: "පාන්", qty: 3, price: 90 },
  { id: 2, name: "ක්‍රීම් රෝල්", qty: 2, price: 160 },
  { id: 3, name: "එලවලු රෝල්", qty: 4, price: 130 },
  { id: 4, name: "බටර් කේක්", qty: 1, price: 450 },
];

/** English / overseas-style grocer demo — used when English is selected */
export const FOREIGN_SHOP_DETAILS: ShopDetails = {
  name: "Zero market",
  bakeryShopName: "Zero Bakery",
  pcShopName: "Modern Bytes PC",
  pcShopNote: "Custom builds · Gaming rigs · Repairs · Diagnostics · Delivery",
  address: "450 N Michigan Ave, Chicago, IL 60611",
  phone: "+1 (312) 555-0198",
  thankYouMessage: "Thanks for shopping — we appreciate your visit!",
  openingHours: "",
  bakeryNote: "Artisan breads · Cakes · Custom orders · Catering",
};

export const FOREIGN_SHOP_ITEMS: CartItem[] = [
  { id: 101, name: "Sourdough loaf", qty: 1, price: 7.5 },
  { id: 102, name: "Croissant", qty: 3, price: 3.25 },
  { id: 103, name: "Blueberry muffin", qty: 2, price: 3.99 },
  { id: 104, name: "Cinnamon roll", qty: 4, price: 2.75 },
];
