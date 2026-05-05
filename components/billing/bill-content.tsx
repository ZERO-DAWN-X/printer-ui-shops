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
  total,
  cashReceived,
}: BillContentProps) => {
  const barcodeValue = `${receiptNo}000${items.length}`;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const change = Math.max(0, cashReceived - total);

  return (
    <div className="receipt-content">
      <div className="mb-3 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{shopDetails.name}</h1>
        <p className="mt-1 text-[13px]">{shopDetails.address}</p>
        <p className="text-[13px]">Tel: {shopDetails.phone}</p>
      </div>

      <Dashed />

      <div className="mb-1 text-[13px]">
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

      <div className="mb-1 flex text-[13px] font-semibold uppercase">
        <span className="w-1/2">Item</span>
        <span className="w-1/4 text-center">Qty</span>
        <span className="w-1/4 text-right">Amount</span>
      </div>
      <Dashed />

      <div className="min-h-[40px]">
        {items.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-400">No items added</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="mb-1.5 flex text-[13px]">
              <span className="w-1/2 pr-1">{item.name}</span>
              <span className="w-1/4 text-center font-mono tabular-nums">{item.qty}</span>
              <span className="w-1/4 text-right font-mono tabular-nums">{(item.qty * item.price).toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      <Dashed />

      <div>
        <div className="flex justify-between text-[13px]">
          <span>Sub Total</span>
          <span className="font-mono tabular-nums">{subTotal.toFixed(2)}</span>
        </div>
        <div style={{ borderTop: "1.5px solid #000", margin: "4px 0" }} />
        <div className="flex justify-between text-[18px] font-semibold">
          <span>TOTAL:</span>
          <span className="font-mono tabular-nums">Rs {total.toFixed(2)}</span>
        </div>
        <div style={{ borderTop: "1.5px solid #000", margin: "4px 0" }} />
        <div className="mt-1 flex justify-between text-[13px]">
          <span>CASH</span>
          <span className="font-mono tabular-nums">{cashReceived.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-[13px] font-medium">
          <span>Change</span>
          <span className="font-mono tabular-nums">{change.toFixed(2)}</span>
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

      <div className="mb-2 mt-2 text-center text-[13px] font-medium">
        <p>{shopDetails.thankYouMessage}</p>
      </div>

      <div className="mt-3 text-center text-[10px]">
        <span>System by Zero Solution</span>
        <div>TEL: 070 133 7419</div>
      </div>

    </div>
  );
};
