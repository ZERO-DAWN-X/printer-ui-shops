import type { BillContentProps } from "@/components/billing/bill-content";
import { Barcode } from "@/components/billing/barcode";
import { ReceiptItemRow } from "@/components/billing/receipt-item-row";
import { formatMoneyTotal } from "@/utils/billing";

const Dashed = () => (
  <div className="receipt-section" style={{ borderTop: "1.5px dashed #000", margin: "5px 0" }} />
);

/** Decorative loaf + wheat — thermal-safe black strokes only */
function BakeryHeaderMark() {
  return (
    <svg
      className="mx-auto block h-[42px] w-[72px]"
      viewBox="0 0 72 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
    >
      {/* Steam */}
      <path
        d="M28 6c2-2 5-2 6 0M34 4c2.5-2 6-2 8 0M42 5c2-2 5.5-2 7 0"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* Loaf */}
      <path
        d="M16 32c0-7 6.5-12.5 20-12.5S56 25 56 32"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <ellipse cx="36" cy="25" rx="19" ry="7.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M24 24.5c2-1.5 5-2.2 12-2.2s10 .7 12 2.2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* Slashes (baguette) */}
      <path d="M28 22l4-3M36 20l4-2M44 22l4-3" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" opacity="0.55" />
      {/* Wheat stems */}
      <path d="M8 36l4-10M10 34l-3-3M6 32l4-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      <path d="M64 36l-4-10M62 34l3-3M66 32l-4-2" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
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
        <div className="relative mx-auto mb-2 max-w-[17rem] px-2 py-2 text-black">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block h-px min-w-[1.25rem] flex-1 bg-black opacity-80" aria-hidden />
            <div className="shrink-0 text-black">
              <BakeryHeaderMark />
            </div>
            <span className="inline-block h-px min-w-[1.25rem] flex-1 bg-black opacity-80" aria-hidden />
          </div>
          <p className="mt-1 font-sans text-[7px] font-bold uppercase tracking-[0.42em] text-black">
            Bakery
          </p>
          <p className="mt-0.5 font-sans text-[6.5px] uppercase tracking-[0.28em] text-black/55">
            Oven-fresh · Daily baked
          </p>
        </div>

        <div className="mx-auto mb-1 inline-flex items-center rounded-full border border-black px-2 py-px text-[9px] font-semibold uppercase tracking-[0.14em] leading-none">
          Cash Bill
        </div>
        <h1 className="font-sans text-[26px] font-extrabold leading-[1.12] tracking-tight">{shopDetails.name}</h1>
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
