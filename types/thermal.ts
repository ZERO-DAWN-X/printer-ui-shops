import type { CartItem, ShopDetails } from "@/types/billing";

export type ReceiptPayload = {
  receiptNo: string;
  billDate: string;
  billTime: string;
  items: CartItem[];
  shopDetails: ShopDetails;
  subTotal: number;
  tax: number;
  total: number;
};

export type DirectThermalPrintRequest = {
  host?: string;
  port?: number;
  payload: ReceiptPayload;
};

export type ThermalConnectionMode = "usb" | "network";
