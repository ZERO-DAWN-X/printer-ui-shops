import type { BillContentProps } from "@/components/billing/bill-content";
import { Barcode } from "@/components/billing/barcode";
import { ReceiptItemRow } from "@/components/billing/receipt-item-row";
import { formatMoneyTotal } from "@/utils/billing";

const Dashed = () => (
  <div className="receipt-section" style={{ borderTop: "1.5px dashed #000", margin: "5px 0" }} />
);

/**
 * Merged bakery mark: colored badge layout (THE BEST · loaf · wheat · stars)
 * plus receipt-style typography (screen + color-capable print).
 */
function BakeryMergedLogo() {
  const maroon = "#5c2438";
  const gold = "#e5bd78";
  const wheat = "#d4a574";
  const ink = "#3d1822";

  return (
    <svg
      className="mx-auto block h-[76px] w-full max-w-[12.5rem]"
      viewBox="0 0 200 104"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
    >
      {/* THE BEST — centered (print-safe vs textPath) */}
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

      {/* Stars */}
      <polygon points="58,22 59.2,25 62.8,25 60,27 61,31 58,29 55,31 56,27 53.2,25 56.8,25" fill={maroon} />
      <polygon points="142,22 143.2,25 146.8,25 144,27 145,31 142,29 139,31 140,27 137.2,25 140.8,25" fill={maroon} />

      {/* Steam */}
      <path
        d="M88 34c2-3 5-3 7 0M96 31c2.5-3 6-3 8 0M104 34c2-3 5.5-3 7 0"
        fill="none"
        stroke={ink}
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Wheat stalks */}
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

      {/* Bread loaf */}
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

      {/* BAKERY */}
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

      {/* HOUSE IN TOWN */}
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

/** Type 5 — bakery-themed header with illustrated mark; body matches classic thermal layout */
export const BillContentBakery = ({
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

  return (
    <div className="receipt-content font-mono text-[12px] leading-[1.35] text-black">
      <div className="receipt-section text-center">
        <div className="relative mx-auto mb-2 max-w-[17rem] px-1 py-1 text-black">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block h-px min-w-5 max-w-[3.25rem] flex-1 bg-black opacity-80" aria-hidden />
            <div className="min-w-0 shrink">
              <BakeryMergedLogo />
            </div>
            <span className="inline-block h-px min-w-5 max-w-[3.25rem] flex-1 bg-black opacity-80" aria-hidden />
          </div>
          <p className="mt-1.5 font-sans text-[6.5px] font-semibold uppercase tracking-[0.32em] text-black/45">
            Oven-fresh – Daily baked
          </p>
        </div>

        <h1 className="mt-1 font-sans text-[26px] font-extrabold leading-[1.12] tracking-tight">{shopDetails.name}</h1>
        <p className="mt-0.5 font-sans text-[12px] leading-[1.35]">{shopDetails.address}</p>
        <p className="text-[12px] leading-[1.35]">Tel: {shopDetails.phone}</p>
      </div>

      <Dashed />

      <div className="receipt-section text-[12px] leading-[1.35]">
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

      <div className="receipt-section mb-1 flex text-[12px] font-bold uppercase tracking-wide leading-[1.3]">
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

      <div className="text-[12px] leading-[1.35]">
        <div className="receipt-row flex justify-between gap-2 px-1.5 py-px">
          <span className="flex-1 font-normal">Sub Total</span>
          <span className="w-24 text-right font-mono tabular-nums font-normal">{subTotal.toFixed(2)}</span>
        </div>
        <div className="receipt-row flex justify-between gap-2 px-1.5 py-px">
          <span className="flex-1 font-normal">Tax</span>
          <span className="w-24 text-right font-mono tabular-nums font-normal">{tax.toFixed(2)}</span>
        </div>
        <div
          className="total-highlight my-2 flex justify-between font-extrabold leading-none text-[17px] text-white tracking-wide"
          style={{ backgroundColor: "#000", color: "#fff", padding: "6px 8px", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
        >
          <span className="flex-1">TOTAL</span>
          <span className="w-27 text-right font-mono tabular-nums text-white">
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

      <div className="text-center text-[11px] leading-[1.35] text-black/70">
        <span>Items: {items.length}</span>
        <span className="mx-2 opacity-70">|</span>
        <span>Qty: {totalQty}</span>
      </div>

      <Dashed />

      <Barcode code={barcodeValue} />

      <div className="mt-2 text-center font-sans text-[12px] font-bold leading-snug">
        <p>{shopDetails.thankYouMessage}</p>
      </div>

      <div className="mt-2 text-center text-[10px] leading-[1.35] text-black/65">
        <span>System by Zero Solution</span>
        <div>TEL: 076 332 7419</div>
      </div>
    </div>
  );
};
