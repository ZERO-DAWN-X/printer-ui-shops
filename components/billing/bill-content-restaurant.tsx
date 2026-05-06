import type { BillContentProps } from "@/components/billing/bill-content";
import { Barcode } from "@/components/billing/barcode";
import { ReceiptItemRow } from "@/components/billing/receipt-item-row";
import { formatMoneyTotal } from "@/utils/billing";

const Dashed = () => (
  <div className="receipt-section" style={{ borderTop: "1.5px dashed #000", margin: "5px 0" }} />
);

const receiptInkStyle = { WebkitPrintColorAdjust: "exact" as const, printColorAdjust: "exact" as const };

/**
 * Harbor-inspired dining mark — waves, charger + cloche, gold rim.
 * Thermal / B&W printers: contrast via stroke weights + fill-opacity.
 */
function RestaurantMark() {
  const harbor = "#1e3a5f";
  const ink = "#1c1917";
  const gold = "#b45309";
  const cream = "#faf8f5";
  return (
    <svg
      className="mx-auto block h-[80px] w-full max-w-56 sm:h-[84px]"
      viewBox="0 0 140 94"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      focusable="false"
      style={{ ...receiptInkStyle }}
    >
      {/* Water line — harbor cue */}
      <path
        d="M6 76c14-6 26-6 38 2s26 10 42 4 28-10 42-6"
        fill="none"
        stroke={harbor}
        strokeWidth="1.35"
        strokeLinecap="round"
        opacity="0.55"
      />
      <ellipse cx="70" cy="81" rx="62" ry="8" fill={harbor} fillOpacity="0.07" />

      {/* Charger + inner plate */}
      <ellipse cx="70" cy="52" rx="48" ry="28" fill={cream} stroke={harbor} strokeWidth="2" />
      <ellipse cx="70" cy="52" rx="41" ry="22" fill="#fffefb" stroke={gold} strokeWidth="1" strokeOpacity="0.92" />

      {/* Cloche — sits on plate shoulder */}
      <path
        d="M41 37 Q70 10 99 37"
        fill="none"
        stroke={ink}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="70" y1="10" x2="70" y2="5" stroke={ink} strokeWidth="1.85" strokeLinecap="round" />
      <circle cx="70" cy="4" r="3.35" fill={gold} fillOpacity="0.95" stroke={ink} strokeWidth="0.9" />

      {/* Steam */}
      <path
        d="M53 21c3-6 11-8 14-2M62 17c5-9 14-10 18-3M71 21c5-7 13-8 15-3"
        fill="none"
        stroke={harbor}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeOpacity="0.65"
      />

      {/* Serving reflection */}
      <ellipse cx="70" cy="56" rx="22" ry="9" fill={harbor} fillOpacity="0.06" />

      {/* Fork — slim */}
      <path
        d="M21 34v52M18.75 34h4.5M18.75 42h4.5M18.75 50h4.5M18.75 58h4.5"
        stroke={ink}
        strokeWidth="1.9"
        strokeLinecap="round"
        fill="none"
      />

      {/* Knife */}
      <path d="M119 34v52" stroke={ink} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path
        d="M119 34l11 9v13l-11 9"
        fill={ink}
        stroke={ink}
        strokeWidth="0.6"
        strokeLinejoin="round"
        opacity="0.96"
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
