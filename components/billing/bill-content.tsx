import type { BillingCurrency, CartItem, ShopDetails } from "@/types/billing";
import { Barcode } from "@/components/billing/barcode";
import { ReceiptItemRow } from "@/components/billing/receipt-item-row";
import { ReceiptItemRowType8 } from "@/components/billing/receipt-item-row-type8";
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
  receiptStackedGridGapClass,
  receiptStackedGridTemplateClass,
  receiptStackedHeaderCellClass,
  receiptStackedHeaderClass,
} from "@/components/billing/receipt-typography";
import { resolveReceiptLabels } from "@/components/billing/receipt-labels";
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
  /** Type 8: item row is split into label line + values line. */
  itemVariant?: "classic" | "stacked";
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
  itemVariant = "classic",
}: BillContentProps) => {
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

      {itemVariant === "stacked" ? (
        <div
          className={`${receiptStackedHeaderClass} ${receiptStackedGridTemplateClass} ${receiptStackedGridGapClass}`}
        >
          <span className="col-start-1 text-left" aria-hidden />
          <span className={`col-start-2 ${receiptStackedHeaderCellClass}`}>{labels.qty}</span>
          <span className={`col-start-3 ${receiptStackedHeaderCellClass}`}>{labels.listedPrice}</span>
          <span className={`col-start-4 ${receiptStackedHeaderCellClass}`}>{labels.ourPrice}</span>
          <span className={`col-start-5 ${receiptStackedHeaderCellClass}`}>{labels.amount}</span>
        </div>
      ) : (
        <div className={receiptItemColumnHeaderClass}>
          <span className="flex-1">{labels.item}</span>
          <span className="w-16 text-right">{labels.amount}</span>
        </div>
      )}
      <Dashed />

      <div className="min-h-[40px]">
        {items.length === 0 ? (
          <div className="py-2 text-center italic">No items</div>
        ) : (
          items.map((item) =>
            itemVariant === "stacked" ? (
              <ReceiptItemRowType8 key={item.id} item={item} />
            ) : (
              <ReceiptItemRow key={item.id} item={item} />
            ),
          )
        )}
      </div>

      <Dashed />

      <div className={receiptTotalsSectionClass}>
        {totalVariant === "ribbon" ? (
          <div className="my-2.5 flex w-full justify-center px-0.5">
            <div
              className={`total-highlight flex w-full max-w-full items-center justify-between gap-2 py-1 font-extrabold leading-snug ${receiptTotalEmphasisClass}`}
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
              <span className="min-w-0 flex-1 whitespace-normal text-white tracking-wide">{labels.total}</span>
              <span
                className={`shrink-0 whitespace-nowrap text-right font-mono tabular-nums leading-snug text-white ${receiptTotalEmphasisClass}`}
              >
                {formatMoneyTotal(total, currency)}
              </span>
            </div>
          </div>
        ) : (
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
