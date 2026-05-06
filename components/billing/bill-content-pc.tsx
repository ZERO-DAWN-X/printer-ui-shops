import type { BillContentProps } from "@/components/billing/bill-content";
import { Barcode } from "@/components/billing/barcode";
import { ReceiptItemRow } from "@/components/billing/receipt-item-row";
import {
  receiptContentRootStyle,
  receiptHeadingFontStyle,
  receiptShopTitleClass,
} from "@/components/billing/receipt-root-font";
import {
  receiptAddressLineClass,
  receiptContentWrapperClass,
  receiptItemColumnHeaderClass,
  receiptLedgerSectionClass,
  receiptQtyMetaClass,
  receiptSystemCreditClass,
  receiptTelLineClass,
  receiptThankYouBlockClass,
  receiptTotalEmphasisClass,
  receiptTotalsSectionClass,
} from "@/components/billing/receipt-typography";
import { formatMoneyTotal } from "@/utils/billing";

const Dashed = () => (
  <div className="receipt-section" style={{ borderTop: "1.5px dashed #000", margin: "5px 0" }} />
);

/**
 * Minimal “modern workstation” mark — retained as Type 6 logo (cyan accent, thermal-friendly).
 */
function PcShopMark() {
  return (
    <svg
      className="mx-auto block h-[72px] w-full max-w-52"
      viewBox="0 0 128 84"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
    >
      <ellipse cx="64" cy="38" rx="46" ry="34" fill="#0891b2" fillOpacity="0.12" />
      <rect x="24" y="14" width="80" height="48" rx="7" fill="none" stroke="#0f172a" strokeWidth="1.65" />
      <rect x="30" y="20" width="68" height="36" rx="4" fill="#164e63" fillOpacity="0.28" stroke="#0e7490" strokeOpacity="0.85" strokeWidth="1" />
      <rect x="36" y="26" width="22" height="4" rx="2" fill="#0f172a" fillOpacity="0.95" />
      <rect x="62" y="26" width="30" height="3" rx="1.5" fill="#0f172a" fillOpacity="0.58" />
      <rect x="36" y="34" width="56" height="2.5" rx="1.2" fill="#0f172a" fillOpacity="0.48" />
      <rect x="58" y="14" width="12" height="5" rx="2" fill="#0f172a" />
      <path d="M52 62h24l6 11H46z" fill="#0f172a" opacity="0.95" />
      <rect x="18" y="72" width="92" height="9" rx="4.5" fill="#0f172a" opacity="0.92" />
      <circle cx="40" cy="76.5" r="2" fill="#64748b" opacity="0.65" />
      <circle cx="88" cy="76.5" r="2" fill="#64748b" opacity="0.65" />
    </svg>
  );
}

/** Type 6 — PC shop header (+ logo); body matches classic thermal layout */
export const BillContentPc = ({
  receiptNo,
  billDate,
  billTime,
  items,
  shopDetails,
  subTotal,
  tax,
  total,
  cashReceived,
  currency = "lkr",
}: BillContentProps) => {
  const barcodeValue = `${receiptNo}000${items.length}`;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const change = Math.max(0, cashReceived - total);
  const pcTitle = shopDetails.pcShopName.trim() || shopDetails.name;

  return (
    <div className={receiptContentWrapperClass} style={receiptContentRootStyle}>
      <div className="receipt-section text-center">
        <div className="relative mx-auto mb-1.5 max-w-76 px-1 pt-1 text-black">
          <div className="flex justify-center">
            <PcShopMark />
          </div>
          <p
            className="mt-1 font-sans text-[9px] font-bold uppercase tracking-[0.42em] text-zinc-950"
            style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", color: "#0a0a0a" }}
          >
            PC shop
          </p>
          <p
            className="mt-0.5 font-sans text-[8px] font-semibold uppercase tracking-[0.26em] text-zinc-950"
            style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", color: "#0a0a0a" }}
          >
            Hardware · Repairs · Upgrades
          </p>
        </div>

        <h1 className={`mt-1 ${receiptShopTitleClass}`} style={receiptHeadingFontStyle}>
          {pcTitle}
        </h1>
        <p className={receiptAddressLineClass}>{shopDetails.address}</p>
        <p className={receiptTelLineClass}>Tel: {shopDetails.phone}</p>
        {shopDetails.openingHours.trim() ? (
          <p
            className="mt-1 text-[11px] font-semibold leading-snug text-zinc-950"
            style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", color: "#141414" }}
          >
            {shopDetails.openingHours}
          </p>
        ) : null}
        {shopDetails.pcShopNote.trim() ? (
          <p
            className="mt-1 text-[10px] font-semibold leading-snug text-zinc-950 sm:text-[11px]"
            style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", color: "#141414" }}
          >
            {shopDetails.pcShopNote}
          </p>
        ) : null}
      </div>

      <Dashed />

      <div className={receiptLedgerSectionClass}>
        <div className="flex justify-between">
          <span>Receipt#</span>
          <span className="font-mono tabular-nums">{receiptNo}</span>
        </div>
        <div className="flex justify-between">
          <span>Cashier</span>
          <span>Admin</span>
        </div>
        <div className="flex justify-between">
          <span>Date</span>
          <span className="font-mono tabular-nums">{billDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Time</span>
          <span className="font-mono tabular-nums">{billTime}</span>
        </div>
      </div>

      <Dashed />

      <div className={receiptItemColumnHeaderClass}>
        <span className="flex-1">Item</span>
        <span className="w-16 text-right">Amount</span>
      </div>
      <Dashed />

      <div className="min-h-[40px]">
        {items.length === 0 ? (
          <div className="py-2 text-center italic">No items</div>
        ) : (
          items.map((item) => <ReceiptItemRow key={item.id} item={item} />)
        )}
      </div>

      <Dashed />

      <div className={receiptTotalsSectionClass}>
        <div className="receipt-row flex justify-between gap-2 px-1.5 py-px">
          <span className="flex-1 font-normal">Sub Total</span>
          <span className="w-24 text-right font-mono tabular-nums font-normal">{subTotal.toFixed(2)}</span>
        </div>
        <div className="receipt-row flex justify-between gap-2 px-1.5 py-px">
          <span className="flex-1 font-normal">Tax</span>
          <span className="w-24 text-right font-mono tabular-nums font-normal">{tax.toFixed(2)}</span>
        </div>
        <div
          className={`total-highlight my-2 flex items-center justify-between gap-2 py-1.5 font-extrabold leading-snug text-white tracking-wide ${receiptTotalEmphasisClass}`}
          style={{
            backgroundColor: "#000",
            color: "#fff",
            paddingLeft: "8px",
            paddingRight: "8px",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          <span className="min-w-0 flex-1 whitespace-normal">TOTAL</span>
          <span className="shrink-0 whitespace-nowrap text-right font-mono tabular-nums leading-snug text-white">
            {formatMoneyTotal(total, currency)}
          </span>
        </div>
        <div className="receipt-row flex justify-between gap-2 px-1.5 py-px font-normal">
          <span className="flex-1">CASH</span>
          <span className="w-24 text-right font-mono tabular-nums">{cashReceived.toFixed(2)}</span>
        </div>
        <div className="receipt-row flex justify-between gap-2 px-1.5 py-px font-bold">
          <span className="flex-1">Change</span>
          <span className="w-24 text-right font-mono tabular-nums">{change.toFixed(2)}</span>
        </div>
      </div>

      <Dashed />

      <div className={receiptQtyMetaClass}>
        <span>Items: {items.length}</span>
        <span className="mx-2 text-black/70" aria-hidden>
          |
        </span>
        <span>Qty: {totalQty}</span>
      </div>

      <Dashed />

      <Barcode code={barcodeValue} />

      <div className={receiptThankYouBlockClass}>
        <p>{shopDetails.thankYouMessage}</p>
      </div>

      <div className={receiptSystemCreditClass}>
        <span>System by Zero Solution</span>
        <div>TEL: 076 332 7419</div>
      </div>
    </div>
  );
};
