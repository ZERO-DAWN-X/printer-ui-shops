import type { CSSProperties } from "react";

/**
 * Monospace as the receipt root breaks Sinhala CTL shaping (e.g. ස්ටෝර්ස් → wrong glyphs).
 * Numbers still use `font-mono` on spans where tabular alignment matters.
 */
export const receiptContentRootStyle: CSSProperties = {
  fontFamily: "var(--font-noto-sinhala), ui-sans-serif, system-ui, sans-serif",
};

/** Main shop / branch title — do not use Tailwind `font-sans`: it binds Geist and breaks Sinhala shaping. */
export const receiptShopTitleClass = "text-[26px] font-extrabold leading-snug";

/** Same stack as receipt root; use on headings so Geist overrides cannot win via cascade. */
export const receiptHeadingFontStyle: CSSProperties = {
  fontFamily: "var(--font-noto-sinhala), ui-sans-serif, system-ui, sans-serif",
};
