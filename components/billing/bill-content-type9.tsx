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
import { resolveReceiptLabels } from "@/components/billing/receipt-labels";
import { formatMoneyTotal } from "@/utils/billing";

const Dashed = () => (
  <div className="receipt-section" style={{ borderTop: "1.5px dashed #000", margin: "5px 0" }} />
);

/**
 * Type 9 — bakery-style header with illustrated mark; body matches classic thermal layout.
 * Copy of Type 5 to allow independent customization without affecting T5.
 */
function Type9MergedLogo() {
  const maroon = "#5c2438";
  const gold = "#e5bd78";
  const wheat = "#d4a574";
  const ink = "#3d1822";

  return (
    <svg
      className="mx-auto block h-[92px] w-full max-w-56 sm:h-[96px] sm:max-w-60"
      viewBox="0 0 200 104"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
    >
      <text
        x="100"
        y="24"
        textAnchor="middle"
        fill={maroon}
        fontFamily="system-ui, Segoe UI, sans-serif"
        fontSize="9"
        fontWeight="700"
        letterSpacing="0.28em"
      >
        THE BEST
      </text>

      <polygon points="58,22 59.2,25 62.8,25 60,27 61,31 58,29 55,31 56,27 53.2,25 56.8,25" fill={maroon} />
      <polygon points="142,22 143.2,25 146.8,25 144,27 145,31 142,29 139,31 140,27 137.2,25 140.8,25" fill={maroon} />

      <path
        d="M88 34c2-3 5-3 7 0M96 31c2.5-3 6-3 8 0M104 34c2-3 5.5-3 7 0"
        fill="none"
        stroke={ink}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.35"
      />

      <g stroke={maroon} strokeWidth="1.15" fill="none" strokeLinecap="round">
        <path d="M36 78 Q28 52 44 38" />
        <path d="M42 52l-4 5M38 46l5 2M46 44l-6 4" opacity="0.9" />
        <ellipse cx="36" cy="78" rx="3" ry="2" fill={wheat} stroke={maroon} strokeWidth="1" />
      </g>
      <g stroke={maroon} strokeWidth="1.15" fill="none" strokeLinecap="round">
        <path d="M164 78 Q172 52 156 38" />
        <path d="M158 52l4 5M162 46l-5 2M154 44l6 4" opacity="0.9" />
        <ellipse cx="164" cy="78" rx="3" ry="2" fill={wheat} stroke={maroon} strokeWidth="1" />
      </g>

      <ellipse cx="100" cy="58" rx="34" ry="14" fill={gold} stroke={maroon} strokeWidth="1.6" />
      <path
        d="M76 54c8-10 40-10 48 0"
        fill="none"
        stroke={maroon}
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path d="M84 56l6-5M94 54l6-4M104 54l6-4M114 56l6-5" stroke={maroon} strokeWidth="1.15" strokeLinecap="round" opacity="0.65" />

      <text
        x="100"
        y="92"
        textAnchor="middle"
        fill={maroon}
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="17"
        fontWeight="700"
        letterSpacing="0.12em"
      >
        BAKERY
      </text>

      <text
        x="100"
        y="102"
        textAnchor="middle"
        fill={maroon}
        fontFamily="system-ui, Segoe UI, sans-serif"
        fontSize="6.5"
        fontWeight="600"
        letterSpacing="0.42em"
      >
        HOUSE IN TOWN
      </text>
    </svg>
  );
}

export const BillContentType9 = ({
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
  const headerTitle = shopDetails.bakeryShopName.trim() || shopDetails.name;
  const labels = resolveReceiptLabels(shopDetails, items);

  return (
    <div className={receiptContentWrapperClass} style={receiptContentRootStyle}>
      <div className="receipt-section text-center">
        <div className="relative mx-auto mb-2 max-w-76 px-1 pt-1 text-black">
          <div className="flex justify-center">
            <div className="min-w-0 shrink">
              <Type9MergedLogo />
            </div>
          </div>
          <p
            className="mt-1.5 font-sans text-[8px] font-semibold uppercase tracking-[0.32em] text-zinc-950"
            style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact", color: "#0a0a0a" }}
          >
            Oven-fresh – Daily baked
          </p>
        </div>

        <h1 className={`mt-1 ${receiptShopTitleClass}`} style={receiptHeadingFontStyle}>
          {headerTitle}
        </h1>
        <p className={receiptAddressLineClass}>
          {shopDetails.bakeryAddress.trim() || shopDetails.address}
        </p>
        <p className={receiptTelLineClass}>
          Tel: {shopDetails.bakeryPhone.trim() || shopDetails.phone}
        </p>
        {shopDetails.openingHours.trim() ? (
          <p className="mt-1 text-[11px] font-medium leading-snug text-black/85">{shopDetails.openingHours}</p>
        ) : null}
        {shopDetails.bakeryNote.trim() ? (
          <p className="mt-1 text-[10px] font-semibold leading-snug text-black/85 sm:text-[11px]">
            {shopDetails.bakeryNote}
          </p>
        ) : null}
      </div>

      <Dashed />

      <div className={receiptLedgerSectionClass}>
        <div className="flex justify-between">
          <span>{labels.receiptNo}</span>
          <span className="font-mono tabular-nums">{receiptNo}</span>
        </div>
        <div className="flex justify-between">
          <span>{labels.cashier}</span>
          <span>Admin</span>
        </div>
        <div className="flex justify-between">
          <span>{labels.date}</span>
          <span className="font-mono tabular-nums">{billDate}</span>
        </div>
        <div className="flex justify-between">
          <span>{labels.time}</span>
          <span className="font-mono tabular-nums">{billTime}</span>
        </div>
      </div>

      <Dashed />

      <div className={receiptItemColumnHeaderClass}>
        <span className="flex-1">{labels.item}</span>
        <span className="w-16 text-right">{labels.amount}</span>
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
          <span className="min-w-0 flex-1 whitespace-normal">{labels.total}</span>
          <span className="shrink-0 whitespace-nowrap text-right font-mono tabular-nums leading-snug text-white">
            {formatMoneyTotal(total, currency)}
          </span>
        </div>
        <div className="receipt-row flex justify-between gap-2 px-1.5 py-px font-normal">
          <span className="flex-1">{labels.cash}</span>
          <span className="w-24 text-right font-mono tabular-nums">{cashReceived.toFixed(2)}</span>
        </div>
        <div className="receipt-row flex justify-between gap-2 px-1.5 py-px font-bold">
          <span className="flex-1">{labels.change}</span>
          <span className="w-24 text-right font-mono tabular-nums">{change.toFixed(2)}</span>
        </div>
      </div>

      <Dashed />

      <div className={receiptQtyMetaClass}>
        <span>{labels.items}: {items.length}</span>
        <span className="mx-2 text-black/70" aria-hidden>
          |
        </span>
        <span>{labels.qty}: {totalQty}</span>
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
