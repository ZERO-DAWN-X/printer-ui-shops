/**
 * Shared thermal receipt type scale — slightly tighter for Sinhala + Latin on one slip.
 * Adjust here to keep all receipt layouts and print preview aligned.
 */

export const receiptContentWrapperClass =
  "receipt-content text-[12px] leading-[1.38] text-black";

export const receiptCashBillBadgeClass =
  "mx-auto mb-1 inline-flex items-center rounded-full border border-black px-2 py-px text-[9px] font-semibold uppercase tracking-[0.14em] leading-none";

export const receiptAddressLineClass = "mt-0.5 text-[12px] font-medium leading-[1.38]";
export const receiptTelLineClass = "text-[12px] font-medium leading-[1.38]";
export const receiptLedgerSectionClass = "receipt-section text-[10px] font-medium leading-[1.32]";
export const receiptItemColumnHeaderClass =
  "receipt-section mb-1 flex text-[12px] font-bold uppercase tracking-wide leading-[1.34]";
export const receiptTotalsSectionClass = "text-[12px] font-medium leading-[1.38]";
export const receiptQtyMetaClass = "text-center text-[11px] font-semibold leading-[1.38] text-black/85";
export const receiptThankYouBlockClass = "mt-2 text-center text-[12px] font-bold leading-snug";
export const receiptSystemCreditClass = "mt-2 text-center text-[10px] font-semibold leading-[1.38] text-black/82";

/** TOTAL banner / emphasized row — keep in sync with print CSS `#print-root .total-highlight`. */
export const receiptTotalEmphasisClass = "text-[16px]";

export const receiptItemRowWrapperClass =
  "receipt-item mb-1.5 flex items-end gap-2 text-[13px] leading-snug";
export const receiptItemPrimaryClass = "break-words text-[13px] font-semibold leading-snug";
export const receiptItemSecondaryClass = "text-[12px] font-semibold text-black/72";
export const receiptItemAmountClass =
  "w-[4.25rem] shrink-0 self-end pb-px text-right font-mono text-[13px] font-semibold tabular-nums leading-none text-black";

export const receiptBarcodeCaptionClass = "mt-1 font-mono text-[10px] font-semibold tracking-widest";

/** Type 8 stacked rows: shared grid/sizing so header and rows always align. */
export const receiptStackedGridTemplateClass =
  "grid-cols-[minmax(0,1fr)_2.45rem_3.75rem_3.75rem_3.75rem]";
export const receiptStackedGridGapClass = "gap-x-1";
export const receiptStackedHeaderClass =
  "receipt-section mb-1 grid items-end py-px text-[10px] font-medium leading-tight";
export const receiptStackedHeaderCellClass = "whitespace-nowrap text-left pl-0.5";
export const receiptStackedRowClass = "receipt-item mb-1.5 grid items-center text-[12px] leading-snug";
export const receiptStackedNameClass = "col-span-5 wrap-break-word text-black";
export const receiptStackedQtyClass = "col-start-2 mt-0.5 text-left text-[11px] tabular-nums text-black/90";
export const receiptStackedValueClass =
  "mt-0.5 text-left font-mono text-[11px] tabular-nums text-black/90";
