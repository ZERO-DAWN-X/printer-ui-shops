import type { CartItem, ShopDetails } from "@/types/billing";

/** Sinhala Unicode block (primary letters, dependent vowels, punctuation). */
const SINHALA = /[\u0D80-\u0DFF]/;

function hasSinhala(text: string): boolean {
  return SINHALA.test(text);
}

/**
 * Sets `lang` on the receipt root for correct complex-script shaping.
 * UI can stay on English while shop name / lines are Sinhala — still use `si`.
 */
export function receiptDocumentLang(
  shopDetails: ShopDetails,
  items: CartItem[],
  previewLocale: "en" | "si",
): "si" | "en" {
  if (previewLocale === "si") return "si";
  const blob = [
    shopDetails.name,
    shopDetails.address,
    shopDetails.thankYouMessage,
    shopDetails.openingHours,
    shopDetails.bakeryNote,
    shopDetails.bakeryShopName,
    shopDetails.pcShopName,
    shopDetails.pcShopNote,
    shopDetails.restaurantShopName,
    shopDetails.restaurantNote,
  ].join("\n");
  if (hasSinhala(blob)) return "si";
  if (items.some((item) => hasSinhala(item.name))) return "si";
  return "en";
}
