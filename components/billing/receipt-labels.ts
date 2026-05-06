import type { CartItem, ShopDetails } from "@/types/billing";

const SINHALA = /[\u0D80-\u0DFF]/;

export type ReceiptLabels = {
  cashBill: string;
  receiptNo: string;
  cashier: string;
  date: string;
  time: string;
  item: string;
  qty: string;
  listedPrice: string;
  ourPrice: string;
  price: string;
  amount: string;
  subTotal: string;
  tax: string;
  total: string;
  cash: string;
  change: string;
  items: string;
};

const EN_LABELS: ReceiptLabels = {
  cashBill: "Cash Bill",
  receiptNo: "Receipt#",
  cashier: "Cashier",
  date: "Date",
  time: "Time",
  item: "Item",
  qty: "Qty",
  listedPrice: "List Price",
  ourPrice: "Our Price",
  price: "Price",
  amount: "Amount",
  subTotal: "Sub Total",
  tax: "Tax",
  total: "TOTAL",
  cash: "CASH",
  change: "Change",
  items: "Items",
};

const SI_LABELS: ReceiptLabels = {
  cashBill: "බිල්පත",
  receiptNo: "රිසිට් අංකය",
  cashier: "අයකැමි",
  date: "දිනය",
  time: "වේලාව",
  item: "භාණ්ඩය",
  qty: "ප්‍රමාණය",
  listedPrice: "සඳහන් මිල",
  ourPrice: "අපේ මිල",
  price: "මිල",
  amount: "එකතුව",
  subTotal: "උප එකතුව",
  tax: "බදු",
  total: "මුළු එකතුව",
  cash: "මුදල්",
  change: "ඉතිරි මුදල",
  items: "භාණ්ඩ",
};

export function resolveReceiptLabels(shopDetails: ShopDetails, items: CartItem[]): ReceiptLabels {
  const blob = `${shopDetails.name}\n${shopDetails.address}\n${items.map((item) => item.name).join("\n")}`;
  return SINHALA.test(blob) ? SI_LABELS : EN_LABELS;
}
