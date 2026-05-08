import type { ReactNode } from "react";
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
} from "@/components/billing/receipt-typography";
import { resolveReceiptLabels } from "@/components/billing/receipt-labels";
import { formatMoneyTotal } from "@/utils/billing";

const Dashed = ({ compact = false }: { compact?: boolean }) => (
  <div
    className="receipt-section"
    style={{ borderTop: "1.5px dashed #000", margin: compact ? "3px 0" : "5px 0" }}
  />
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
  /**
   * Type 8 family — controls items section only; header/totals stay stacked-style:
   *   - `classic`: T1 single-row items (default for T1–T7)
   *   - `stacked`: T8 four-column stacked items (qty / list / our / amount)
   *   - `stacked-simple`: T8-style header but three-column items (qty / price / amount)
   *   - `stacked-classic`: T9 single-row items (T1 style) with stacked header / savings / total bar
   */
  itemVariant?: "classic" | "stacked" | "stacked-simple" | "stacked-classic";
  /** Optional logo rendered at the very top of the header section (above the badge). */
  logo?: ReactNode;
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
  logo,
}: BillContentProps) => {
  const barcodeValue = `${receiptNo}000${items.length}`;
  const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
  const change = Math.max(0, cashReceived - total);
  const savings = items.reduce(
    (sum, item) => sum + Math.max(0, (item.listedPrice ?? item.price) - item.price) * item.qty,
    0,
  );
  const labels = resolveReceiptLabels(shopDetails, items);
  const isStacked =
    itemVariant === "stacked" ||
    itemVariant === "stacked-simple" ||
    itemVariant === "stacked-classic";
  const isSimple = itemVariant === "stacked-simple";
  const isStackedClassic = itemVariant === "stacked-classic";
  const stackedTitleSplitIdx = isStacked ? shopDetails.name.indexOf(" සහ ") : -1;
  const stackedTitleLead =
    stackedTitleSplitIdx > 0 ? shopDetails.name.substring(0, stackedTitleSplitIdx + 3) : null;
  const stackedTitleTrail =
    stackedTitleSplitIdx > 0 ? shopDetails.name.substring(stackedTitleSplitIdx + 4) : null;
  const stackedPhoneList = isStacked
    ? shopDetails.phone
        .split(",")
        .map((raw) => raw.trim())
        .filter((raw) => raw.length > 0)
        .map((raw) => {
          const digits = raw.replace(/\D/g, "");
          return digits.length === 10
            ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
            : raw;
        })
    : null;

  return (
    <div
      className={receiptContentWrapperClass}
      style={
        isStacked
          ? {
              ...receiptContentRootStyle,
              paddingTop: "5mm",
              paddingLeft: "1.5mm",
              paddingRight: "1.5mm",
            }
          : receiptContentRootStyle
      }
    >
      <div className="receipt-section text-center">
        <div
          className={receiptCashBillBadgeClass}
          style={
            isStacked
              ? { marginBottom: "8px", paddingTop: "3px", paddingBottom: "3px" }
              : undefined
          }
        >
          {labels.cashBill}
        </div>
        {logo ? <div className="mb-2 flex justify-center">{logo}</div> : null}
        {stackedTitleLead && stackedTitleTrail ? (
          <h1 className="font-extrabold" style={receiptHeadingFontStyle}>
            <span className="block text-[24px] leading-[1.3]">{stackedTitleLead}</span>
            <span className="mt-1.5 block text-[19px] leading-[1.3]">{stackedTitleTrail}</span>
          </h1>
        ) : (
          <h1 className={receiptShopTitleClass} style={receiptHeadingFontStyle}>
            {shopDetails.name}
          </h1>
        )}
        {isStacked && stackedPhoneList && stackedPhoneList.length > 0 ? (
          <p className="mt-2 text-[13px] font-semibold leading-[1.38]">
            <span aria-hidden className="mr-1 align-middle text-[14px]">
              ☎
            </span>
            <span className="tabular-nums">{stackedPhoneList.join("  ·  ")}</span>
          </p>
        ) : null}
        <p
          className={
            isStacked
              ? "mt-1 pb-2 text-[12px] font-medium leading-[1.4]"
              : receiptAddressLineClass
          }
        >
          {shopDetails.address}
        </p>
        {!isStacked && <p className={receiptTelLineClass}>Tel: {shopDetails.phone}</p>}
      </div>

      {!isStacked && <Dashed />}

      {isStacked ? (
        <div className="receipt-section pb-1 text-[11px] font-medium leading-[1.4]">
          <div className="flex items-baseline justify-between gap-2">
            <span className="tabular-nums">{billDate}</span>
            <span className="tabular-nums">{billTime}</span>
            <span>
              No: <span className="tabular-nums">#{receiptNo}</span>
            </span>
          </div>
        </div>
      ) : (
        <div className={receiptLedgerSectionClass}>
          <div className="flex justify-between">
            <span>{labels.receiptNo}</span>
            <span className="tabular-nums">{receiptNo}</span>
          </div>
          <div className="flex justify-between">
            <span>{labels.cashier}</span>
            <span>Admin</span>
          </div>
          <div className="flex justify-between">
            <span>{labels.date}</span>
            <span className="tabular-nums">{billDate}</span>
          </div>
          <div className="flex justify-between">
            <span>{labels.time}</span>
            <span className="tabular-nums">{billTime}</span>
          </div>
        </div>
      )}

      {isStacked ? (
        <div
          className="receipt-section"
          style={{ borderTop: "1px solid #000", margin: "0 0 8px" }}
        />
      ) : (
        <Dashed />
      )}

      {isStacked && !isStackedClassic ? (
        <div className="receipt-section mb-0.5 flex items-end justify-end gap-x-2 text-[12px] font-semibold leading-tight tracking-tight">
          <span className="w-12 text-left whitespace-nowrap">{labels.qty}</span>
          {isSimple ? null : (
            <span className="w-17 text-center whitespace-nowrap">{labels.listedPrice}</span>
          )}
          <span className="w-17 text-center whitespace-nowrap">{labels.ourPrice}</span>
          <span className="w-17 text-center whitespace-nowrap">{labels.amount}</span>
        </div>
      ) : (
        <div className={receiptItemColumnHeaderClass}>
          <span className="flex-1">{labels.item}</span>
          <span className="w-16 text-right">{labels.amount}</span>
        </div>
      )}
      <Dashed compact={isStacked} />

      <div className="min-h-[40px]">
        {items.length === 0 ? (
          <div className="py-2 text-center italic">No items</div>
        ) : (
          items.map((item) =>
            isStacked && !isStackedClassic ? (
              <ReceiptItemRowType8 key={item.id} item={item} hideListedPrice={isSimple} />
            ) : (
              <ReceiptItemRow key={item.id} item={item} />
            ),
          )
        )}
      </div>

      <Dashed compact={isStacked} />

      <div className={receiptTotalsSectionClass}>
        {isStacked && savings > 0 ? (
          <div className="receipt-row flex items-baseline justify-between gap-2 px-1.5 py-px text-[12px] font-medium">
            <span className="flex-1">{labels.subTotal}</span>
            <span className="w-24 text-right font-semibold tabular-nums">
              {subTotal.toFixed(2)}
            </span>
          </div>
        ) : null}
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
                className={`shrink-0 whitespace-nowrap text-right tabular-nums leading-snug text-white ${receiptTotalEmphasisClass}`}
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
            <span className="min-w-0 flex-1 whitespace-normal text-[13px]">{labels.total}</span>
            <span className="shrink-0 whitespace-nowrap text-right tabular-nums leading-snug text-white">
              {formatMoneyTotal(total, currency)}
            </span>
          </div>
        )}
        <div className="receipt-row flex items-baseline justify-between gap-2 px-1.5 py-px font-normal">
          <span className="flex-1">{labels.cash}</span>
          <span className="w-24 text-right text-[14px] font-bold tabular-nums">
            {cashReceived.toFixed(2)}
          </span>
        </div>
        <div className="receipt-row flex items-baseline justify-between gap-2 px-1.5 py-px text-[13px] font-bold">
          <span className="flex-1">{labels.change}</span>
          <span className="w-24 text-right text-[16px] font-extrabold tabular-nums">
            {change.toFixed(2)}
          </span>
        </div>
      </div>

      {!isStacked && <Dashed />}

      {isStacked && savings > 0 ? (
        <div className="my-1.5 flex items-center justify-center gap-2 border-y-2 border-double border-black px-2 py-1 text-center text-[12.5px] font-bold leading-snug">
          <span aria-hidden>★</span>
          <span>{labels.savings}</span>
          <span className="font-extrabold tabular-nums">
            {formatMoneyTotal(savings, currency)}
          </span>
          <span aria-hidden>★</span>
        </div>
      ) : null}

      <div className={receiptQtyMetaClass}>
        <span>
          {labels.items}: <span className="text-[13px] font-extrabold tabular-nums">{items.length}</span>
        </span>
        <span className="mx-2 text-black/70" aria-hidden>
          |
        </span>
        <span>
          {labels.qty}: <span className="text-[13px] font-extrabold tabular-nums">{totalQty}</span>
        </span>
      </div>

      <Dashed compact={isStacked} />

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
