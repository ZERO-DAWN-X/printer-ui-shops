import type { BillingCurrency, CartItem, ShopDetails } from "@/types/billing";
import { Barcode } from "@/components/billing/barcode";
import { ReceiptItemRow } from "@/components/billing/receipt-item-row";
import {
  receiptContentRootStyle,
  receiptHeadingFontStyle,
  receiptShopTitleClass,
} from "@/components/billing/receipt-root-font";
import {
  receiptAddressLineClass,
  receiptCashBillBadgeClass,
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
  currency?: BillingCurrency;
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
  currency = "lkr",
  totalStyle = "lined",
}: BillContentAltProps) => {
  const barcodeValue = `${receiptNo}000${items.length}`;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const change = Math.max(0, cashReceived - total);
  const labels = resolveReceiptLabels(shopDetails, items);

  return (
    <div className={receiptContentWrapperClass} style={receiptContentRootStyle}>
      <div className="receipt-section text-center">
        <div className={receiptCashBillBadgeClass}>{labels.cashBill}</div>
        <h1 className={receiptShopTitleClass} style={receiptHeadingFontStyle}>
          {shopDetails.name}
        </h1>
        <p className={receiptAddressLineClass}>{shopDetails.address}</p>
        <p className={receiptTelLineClass}>Tel: {shopDetails.phone}</p>
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
        {totalStyle === "ribbon" ? (
          <div className="my-2.5 flex w-full items-center justify-between gap-3 px-1.5">
            <span
              className={`shrink-0 font-extrabold uppercase leading-none tracking-wide text-black ${receiptTotalEmphasisClass}`}
            >
              {labels.total}
            </span>
            <div
              className={`total-highlight ml-auto shrink-0 whitespace-nowrap py-1.5 font-mono font-extrabold leading-snug tabular-nums text-white ${receiptTotalEmphasisClass}`}
              style={{
                backgroundColor: "#000",
                paddingLeft: "20px",
                paddingRight: "18px",
                WebkitPrintColorAdjust: "exact",
                printColorAdjust: "exact",
                clipPath:
                  "polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%, 11px 50%)",
              }}
            >
              {formatMoneyTotal(total, currency)}
            </div>
          </div>
        ) : (
          <>
            <div style={{ borderTop: "1.5px solid #000", margin: "6px 0 4px" }} />
            <div
              className={`my-2 flex items-center justify-between gap-2 py-px font-extrabold leading-snug tracking-wide text-black ${receiptTotalEmphasisClass}`}
            >
              <span className="min-w-0 flex-1">{labels.total}</span>
              <span className="shrink-0 whitespace-nowrap text-right font-mono tabular-nums">{formatMoneyTotal(total, currency)}</span>
            </div>
            <div style={{ borderTop: "1.5px solid #000", margin: "4px 0 6px" }} />
          </>
        )}
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
