import type { CartItem, ShopDetails } from "@/types/billing";
import { Barcode } from "@/components/billing/barcode";

const Dashed = () => (
  <div className="receipt-section" style={{ borderTop: "1.5px dashed #000", margin: "5px 0" }} />
);

function splitItemPrimaryAndEnglish(fullName: string): { primary: string; englishParen?: string } {
  const m = fullName.match(/^\s*(.+?)\s*(\([^)]+\))\s*$/);
  if (!m?.[2]) {
    return { primary: fullName.trim() };
  }
  return { primary: (m[1] ?? "").trim(), englishParen: (m[2] ?? "").trim() };
}

export type BillContentAltProps = {
  receiptNo: string;
  billDate: string;
  billTime: string;
  items: CartItem[];
  shopDetails: ShopDetails;
  subTotal: number;
  tax: number;
  total: number;
  cashReceived: number;
  /** Lined = Type 2 (rules + plain TOTAL). Ribbon = black banner TOTAL (Type 4). */
  totalStyle?: "lined" | "ribbon";
};

export const BillContentAlt = ({
  receiptNo,
  billDate,
  billTime,
  items,
  shopDetails,
  subTotal,
  tax,
  total,
  cashReceived,
  totalStyle = "lined",
}: BillContentAltProps) => {
  const barcodeValue = `${receiptNo}000${items.length}`;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const change = Math.max(0, cashReceived - total);

  return (
    <div className="receipt-content font-mono text-[12px] leading-[1.35] text-black">
      <div className="receipt-section text-center">
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
          items.map((item) => {
            const { primary, englishParen } = splitItemPrimaryAndEnglish(item.name);
            return (
              <div key={item.id} className="receipt-item mb-1 flex items-end gap-1 text-[12px] leading-[1.35]">
                <span className="flex-1 font-sans text-[13px] font-semibold wrap-break-word leading-snug">
                  {primary}{" "}
                  {englishParen ? (
                    <span className="text-[11px] font-medium text-black/55">{englishParen}</span>
                  ) : null}
                  {englishParen ? " " : null}
                  <span className="text-[12px] font-medium text-black/65">
                    ({item.price.toFixed(2)} x {item.qty})
                  </span>
                </span>
                <span className="w-16 shrink-0 text-right font-mono text-[12px] tabular-nums leading-none">
                  {(item.qty * item.price).toFixed(2)}
                </span>
              </div>
            );
          })
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
        {totalStyle === "ribbon" ? (
          <div className="my-2.5 flex w-full items-center justify-between gap-3 px-1.5">
            <span className="shrink-0 font-extrabold uppercase leading-none tracking-wide text-[17px] text-black">
              TOTAL
            </span>
            <div
              className="total-highlight ml-auto shrink-0 font-mono font-extrabold leading-none text-[17px] text-white tabular-nums"
              style={{
                backgroundColor: "#000",
                padding: "6px 18px 6px 12px",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
                clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
              }}
            >
              Rs {total.toFixed(2)}
            </div>
          </div>
        ) : (
          <>
            <div style={{ borderTop: "1.5px solid #000", margin: "6px 0 4px" }} />
            <div className="my-2 flex justify-between font-extrabold leading-none text-[17px] tracking-wide text-black">
              <span className="flex-1">TOTAL</span>
              <span className="w-27 text-right font-mono tabular-nums">Rs {total.toFixed(2)}</span>
            </div>
            <div style={{ borderTop: "1.5px solid #000", margin: "4px 0 6px" }} />
          </>
        )}
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
        <div>TEL: 070 133 7419</div>
      </div>
    </div>
  );
};
