import type { CartItem } from "@/types/billing";

export const calculateSubtotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.qty * item.price, 0);

export const generateReceiptFromSeed = (seed: string): string => {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 900000;
  }

  return (100000 + hash).toString();
};
