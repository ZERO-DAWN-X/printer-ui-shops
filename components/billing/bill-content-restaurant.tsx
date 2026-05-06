import type { BillContentProps } from "@/components/billing/bill-content";
import { Barcode } from "@/components/billing/barcode";
import { ReceiptItemRow } from "@/components/billing/receipt-item-row";
import { formatMoneyTotal } from "@/utils/billing";

const Dashed = () => (
  <div className="receipt-section" style={{ borderTop: "1.5px dashed #000", margin: "5px 0" }} />
);

const receiptInkStyle = { WebkitPrintColorAdjust: "exact" as const, printColorAdjust: "exact" as const };

/** Plate + fork & knife — warm burgundy, thermal / grayscale friendly */
function RestaurantMark() {
  const burgundy = "#7f1d1d";
  const dark = "#292524";
  return (
    <svg
      className="mx-auto block h-[72px] w-full max-w-52"
      viewBox="0 0 128 84"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      style={{ ...receiptInkStyle }}
    >
      <ellipse cx="64" cy="44" rx="44" ry="26" fill="#fafaf9" stroke={burgundy} strokeWidth="2" />
      <ellipse cx="64" cy="44" rx="36" ry="19" fill="none" stroke={dark} strokeWidth="1.2" strokeOpacity="0.55" />
      {/* Fork */}
      <path
        d="M28 18v46M26 18h4M26 26h4M26 34h4M26 42h4"
        stroke={dark}
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Knife */}
      <path d="M100 18v46" stroke={dark} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d="M100 18l8 6v12l-8 5" fill={dark} stroke={dark} strokeWidth="0.8" strokeLinejoin="round" />
      {/* Steam */}
      <path
        d="M54 28c2-4 6-4 8 0M64 26c2.5-4 7-4 9 0M74 28c2-4 6-4 8 0"
        fill="none"
        stroke={burgundy}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
    </svg>
  );
}

/** Type 7 — restaurant header + illustrated mark; body matches classic thermal */
export const BillContentRestaurant = ({
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
  const restaurantTitle = shopDetails.restaurantShopName.trim() || shopDetails.name;

  return (
    <div className="receipt-content font-mono text-[12px] leading-[1.35] text-black">
      <div className="receipt-section text-center">
        <div className="relative mx-auto mb-1.5 max-w-76 px-1 pt-1 text-black">
          <div className="flex justify-center">
            <RestaurantMark />
          </div>
          <p
            className="mt-1 font-sans text-[8px] font-bold uppercase tracking-[0.38em] text-zinc-950"
            style={{ ...receiptInkStyle, color: "#0a0a0a" }}
          >
            Restaurant
          </p>
          <p
            className="mt-0.5 font-sans text-[7px] font-semibold uppercase tracking-[0.22em] text-zinc-950"
            style={{ ...receiptInkStyle, color: "#0a0a0a" }}
          >
            Dine-in · Takeaway · Delivery
          </p>
        </div>

        <h1 className="mt-1 font-sans text-[26px] font-extrabold leading-[1.12] tracking-tight">{restaurantTitle}</h1>
        <p className="mt-0.5 font-sans text-[12px] leading-[1.35]">{shopDetails.address}</p>
        <p className="text-[12px] leading-[1.35]">Tel: {shopDetails.phone}</p>
        {shopDetails.openingHours.trim() ? (
          <p
            className="mt-1 font-sans text-[11px] font-semibold leading-snug text-zinc-950"
            style={{ ...receiptInkStyle, color: "#141414" }}
          >
            {shopDetails.openingHours}
          </p>
        ) : null}
        {shopDetails.restaurantNote.trim() ? (
          <p
            className="mt-1 font-sans text-[10px] font-semibold leading-snug text-zinc-950 sm:text-[11px]"
            style={{ ...receiptInkStyle, color: "#141414" }}
          >
            {shopDetails.restaurantNote}
          </p>
        ) : null}
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
          style={{
            backgroundColor: "#000",
            color: "#fff",
            padding: "6px 8px",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
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
