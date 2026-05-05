import type { CartItem, ShopDetails } from "@/types/billing";
import { Barcode } from "@/components/billing/barcode";

const Dashed = () => (
  <div className="receipt-section" style={{ borderTop: "1.5px dashed #000", margin: "5px 0" }} />
);

type BillContentProps = {
  receiptNo: string;
  billDate: string;
  billTime: string;
  items: CartItem[];
  shopDetails: ShopDetails;
  subTotal: number;
  tax: number;
  total: number;
  cashReceived: number;
};

export const BillContent = ({
  receiptNo,
  billDate,
  billTime,
  items,
  shopDetails,
  subTotal,
  tax,
  total,
  cashReceived,
}: BillContentProps) => {
  const barcodeValue = `${receiptNo}000${items.length}`;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const change = Math.max(0, cashReceived - total);

  return (
    <div className="receipt-content font-mono text-[12px] leading-snug text-black">
      <div className="receipt-section text-center">
        <div className="mx-auto mb-1 inline-flex items-center rounded-full border border-black px-2 py-px text-[9px] font-semibold uppercase tracking-[0.14em]">
          Cash Bill
        </div>
        <h1 className="font-sans text-[28px] font-extrabold leading-[1.15] tracking-tight">{shopDetails.name}</h1>
        <p className="mt-0.5 font-sans text-[12px]">{shopDetails.address}</p>
        <p className="text-[12px]">Tel: {shopDetails.phone}</p>
      </div>

      <Dashed />

      <div className="receipt-section text-[12px]">
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

      <div className="receipt-section mb-1 flex text-[12px] font-bold uppercase tracking-wide">
        <span className="flex-1">Item</span>
        <span className="w-16 text-right">Amount</span>
      </div>
      <Dashed />

      <div className="min-h-[40px]">
        {items.length === 0 ? (
          <div className="py-2 text-center italic">No items</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="receipt-item mb-1 flex items-start gap-1 text-[13px]">
              <span className="flex-1 font-sans text-[14px] font-semibold wrap-break-word leading-tight">
                {item.name}{" "}
                <span className="font-mono tabular-nums text-[11px] text-black/70">
                  ({item.price.toFixed(2)} x {item.qty})
                </span>
              </span>
              <span className="w-16 text-right font-mono tabular-nums">
                {(item.qty * item.price).toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>

      <Dashed />

      <div className="text-[13px]">
        <div className="receipt-row flex justify-between gap-2">
          <span>Sub Total</span>
          <span className="shrink-0 text-right font-mono tabular-nums">{subTotal.toFixed(2)}</span>
        </div>
        <div className="receipt-row flex justify-between gap-2">
          <span>Tax</span>
          <span className="shrink-0 text-right font-mono tabular-nums">{tax.toFixed(2)}</span>
        </div>
        <div style={{ borderTop: "1.5px solid #000", margin: "4px 0" }} />
        <div className="flex justify-between text-[16px] font-extrabold">
          <span>TOTAL</span>
          <span className="font-mono tabular-nums">Rs {total.toFixed(2)}</span>
        </div>
        <div style={{ borderTop: "1.5px solid #000", margin: "4px 0" }} />
        <div className="receipt-row flex justify-between gap-2">
          <span>CASH</span>
          <span className="shrink-0 text-right font-mono tabular-nums">{cashReceived.toFixed(2)}</span>
        </div>
        <div className="receipt-row flex justify-between gap-2 font-bold">
          <span>Change</span>
          <span className="shrink-0 text-right font-mono tabular-nums">{change.toFixed(2)}</span>
        </div>
      </div>

      <Dashed />

      <div className="text-center text-[12px]">
        <span>Items: {items.length}</span>
        <span className="mx-2">|</span>
        <span>Qty: {totalQty}</span>
      </div>

      <Dashed />

      <Barcode code={barcodeValue} />

      <div className="mt-2 text-center font-sans text-[13px] font-bold">
        <p>{shopDetails.thankYouMessage}</p>
      </div>

      <div className="mt-2 text-center text-[11px]">
        <span>System by Zero Solution</span>
        <div>TEL: 070 133 7419</div>
      </div>

    </div>
  );
};
