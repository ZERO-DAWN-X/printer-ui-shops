import type { BillingCurrency, CartItem, ShopDetails } from "@/types/billing";
import { Barcode } from "@/components/billing/barcode";
import { ReceiptItemRow } from "@/components/billing/receipt-item-row";
import {
  receiptContentRootStyle,
  receiptHeadingFontStyle,
  receiptShopTitleClass,
} from "@/components/billing/receipt-root-font";
import { formatMoneyTotal } from "@/utils/billing";

const Dashed = () => (
  <div className="receipt-section" style={{ borderTop: "1.5px dashed #000", margin: "5px 0" }} />
);

export type BillContentProps = {
  receiptNo: string;
  billDate: string;
  billTime: string;
  items: CartItem[];
  shopDetails: ShopDetails;
  subTotal: number;
  tax: number;
  total: number;
  cashReceived: number;
  currency?: BillingCurrency;
  /** Classic = full-width bar. Ribbon = pointed banner (used by Type 3). */
  totalVariant?: "classic" | "ribbon";
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
  currency = "lkr",
  totalVariant = "classic",
}: BillContentProps) => {
  const barcodeValue = `${receiptNo}000${items.length}`;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const change = Math.max(0, cashReceived - total);

  return (
    <div className="receipt-content text-[12px] leading-[1.35] text-black" style={receiptContentRootStyle}>
      <div className="receipt-section text-center">
        <div className="mx-auto mb-1 inline-flex items-center rounded-full border border-black px-2 py-px text-[9px] font-semibold uppercase tracking-[0.14em] leading-none">
          Cash Bill
        </div>
        <h1 className={receiptShopTitleClass} style={receiptHeadingFontStyle}>
          {shopDetails.name}
        </h1>
        <p className="mt-0.5 text-[12px] leading-[1.35]">{shopDetails.address}</p>
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
        {totalVariant === "ribbon" ? (
          <div className="my-2.5 flex w-full justify-center px-0.5">
            <div
              className="total-highlight flex w-full max-w-full items-center justify-between gap-2 py-1 font-extrabold leading-snug text-[17px]"
              style={{
                backgroundColor: "#000",
                color: "#fff",
                paddingLeft: "14px",
                paddingRight: "14px",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
                clipPath:
                  "polygon(11px 0%, calc(100% - 11px) 0%, 100% 50%, calc(100% - 11px) 100%, 11px 100%, 0 50%)",
              }}
            >
              <span className="min-w-0 flex-1 whitespace-normal text-white tracking-wide">TOTAL</span>
              <span className="shrink-0 whitespace-nowrap text-right font-mono text-[17px] tabular-nums leading-snug text-white">
                {formatMoneyTotal(total, currency)}
              </span>
            </div>
          </div>
        ) : (
          <div
            className="total-highlight my-2 flex items-center justify-between gap-2 py-1.5 font-extrabold leading-snug text-[17px] text-white tracking-wide"
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

      <div className="mt-2 text-center text-[12px] font-bold leading-snug">
        <p>{shopDetails.thankYouMessage}</p>
      </div>

      <div className="mt-2 text-center text-[10px] leading-[1.35] text-black/65">
        <span>System by Zero Solution</span>
        <div>TEL: 076 332 7419</div>
      </div>

    </div>
  );
};
