import type { CartItem, ShopDetails } from "@/types/billing";

/** Sinhala / local demo — used when Sinhala is selected */
export const DEFAULT_SHOP_DETAILS: ShopDetails = {
  name: "සඳලු ස්ටෝර්ස් සහ කුළුබඩු නිෂ්පාදකයෝ",
  bakeryShopName: "සඳගිරි බේක් ඇන්ඩ් සේවර්",
  pcShopName: "Smart Solution",
  pcShopNote: "ලැප්ටොප් · ගේමින් · ගොඩනැගීම් · අලුත්වැඩියා · දෝෂ හඳුනා ගැනීම · ගෙදරට බෙදා හැරීම",
  restaurantShopName: "ගම්මානය",
  restaurantNote: "සම්ප්‍රදායික ආහාර · පීසා · තේ සහ කෝපි",
  address: "අංක 07, මාර්කට්, පරණ ඇල්ල පාර, වැල්ලවාය.",
  phone: "0719351132,0703919932",
  bakeryAddress: "අංක 58, මොනරාගල පාර, වැල්ලවාය",
  bakeryPhone: "0761150098",
  thankYouMessage: "ස්තූතියි, නැවත එන්න!",
  openingHours: "ලියාපදිංචි අංකය, mo/ වැ /1050",
  bakeryNote: "බේකරි හා කේක් · විශේෂ ඇණවුම් · ගෙදරටම බෙදා හැරීම",
};

export const DEFAULT_ITEMS: CartItem[] = [
  { id: 1, name: "පාන්", qty: 3, price: 90, listedPrice: 100 },
  { id: 2, name: "ක්‍රීම් රෝල්", qty: 2, price: 160, listedPrice: 175 },
  { id: 3, name: "එලවලු රෝල්", qty: 4, price: 130, listedPrice: 145 },
  { id: 4, name: "බටර් කේක්", qty: 1, price: 450, listedPrice: 500 },
  { id: 5, name: "සොසේජස් බනිස්", qty: 2, price: 100, listedPrice: 110 },
  { id: 6, name: "බිත්තර බනිස්", qty: 3, price: 100, listedPrice: 110 },
];

/** English / overseas-style grocer demo — used when English is selected */
export const FOREIGN_SHOP_DETAILS: ShopDetails = {
  name: "Zero market",
  bakeryShopName: "Sandagiri Bake and Savor",
  pcShopName: "Smart Solution",
  pcShopNote: "Custom builds · Gaming rigs · Repairs · Diagnostics · Delivery",
  restaurantShopName: "Harbor Kitchen",
  restaurantNote: "Seafood · Grill · Coffee · Wine · Lunch specials",
  address: "450 N Michigan Ave, Chicago, IL 60611",
  phone: "+1 (312) 555-0198",
  bakeryAddress: "No. 58, Monaragala Road, Wellawaya",
  bakeryPhone: "0761150098",
  thankYouMessage: "Thanks for shopping — we appreciate your visit!",
  openingHours: "",
  bakeryNote: "Artisan breads · Cakes · Custom orders · Catering",
};

export const FOREIGN_SHOP_ITEMS: CartItem[] = [
  { id: 101, name: "Sourdough loaf", qty: 1, price: 7.5 },
  { id: 102, name: "Croissant", qty: 3, price: 3.25 },
  { id: 103, name: "Blueberry muffin", qty: 2, price: 3.99 },
  { id: 104, name: "Cinnamon roll", qty: 4, price: 2.75 },
  { id: 105, name: "Sausage bun", qty: 2, price: 4.5 },
  { id: 106, name: "Egg bun", qty: 3, price: 4.25 },
];

/** Receipt grid T6 preview (English USD) — PC shop themed */
export const FOREIGN_PC_PREVIEW_ITEMS: CartItem[] = [
  { id: 201, name: "NVMe SSD 1TB upgrade", qty: 1, price: 89 },
  { id: 202, name: "DDR5 RAM 16GB kit", qty: 2, price: 42 },
  { id: 203, name: "PC cleaning / thermal repaste", qty: 1, price: 45 },
  { id: 204, name: "USB-C docking hub", qty: 1, price: 65 },
];

/** Receipt grid T7 preview (English USD) — restaurant themed */
export const FOREIGN_RESTAURANT_PREVIEW_ITEMS: CartItem[] = [
  { id: 301, name: "Grilled tiger prawns", qty: 2, price: 16.95 },
  { id: 302, name: "12-inch Margherita pizza", qty: 1, price: 14.5 },
  { id: 303, name: "Caffè latte", qty: 3, price: 4.75 },
  { id: 304, name: "Harbor lunch platter", qty: 2, price: 12.99 },
];

/** Receipt grid T6 when Sinhala is selected — English line text, LKR demo prices */
export const DEFAULT_PC_PREVIEW_ITEMS: CartItem[] = [
  { id: 901, name: "NVMe SSD 512GB upgrade", qty: 1, price: 12500 },
  { id: 902, name: "DDR5 RAM 16GB kit", qty: 2, price: 7200 },
  { id: 903, name: "PC cleaning / thermal repaste", qty: 1, price: 3500 },
  { id: 904, name: "USB-C docking hub", qty: 1, price: 4500 },
];

/** Bakery preview cart (Sinhala LKR) — Sandagiri Bake & Savor sample order */
export const DEFAULT_BAKERY_PREVIEW_ITEMS: CartItem[] = [
  { id: 401, name: "පාන්", qty: 1, price: 140, listedPrice: 150 },
  { id: 402, name: "සීනි සම්බල් බනිස්", qty: 3, price: 60, listedPrice: 70 },
  { id: 403, name: "මාළු බනිස්", qty: 2, price: 70, listedPrice: 80 },
  { id: 404, name: "පේස්ට්‍රි", qty: 1, price: 100, listedPrice: 110 },
  { id: 405, name: "බටර් කේක් (1kg)", qty: 1, price: 1000, listedPrice: 1100 },
];

/** Bakery preview cart (English LKR) — Sandagiri Bake & Savor sample order */
export const FOREIGN_BAKERY_PREVIEW_ITEMS: CartItem[] = [
  { id: 501, name: "Bread", qty: 1, price: 140, listedPrice: 150 },
  { id: 502, name: "Seeni Sambal Bun", qty: 3, price: 60, listedPrice: 70 },
  { id: 503, name: "Fish Bun", qty: 2, price: 70, listedPrice: 80 },
  { id: 504, name: "Pastry", qty: 1, price: 100, listedPrice: 110 },
  { id: 505, name: "Butter Cake 1kg", qty: 1, price: 1000, listedPrice: 1100 },
];

/** Receipt grid T7 preview (Sinhala LKR) — ලංකා · පීසා · තේ දිස්තන්තය */
export const DEFAULT_RESTAURANT_PREVIEW_ITEMS: CartItem[] = [
  { id: 801, name: "එළ බත හා බැදුම් තැබිලිය", qty: 4, price: 220 },
  { id: 802, name: "චිකන් පීසා (මැද)", qty: 1, price: 1950 },
  { id: 803, name: "කෝපි කැපියුසිනෝ", qty: 3, price: 650 },
  { id: 804, name: "විශේෂ මධ්‍යහන ආහාර පැකේජය", qty: 2, price: 890 },
];
