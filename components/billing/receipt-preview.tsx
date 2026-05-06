import { BillContent } from "@/components/billing/bill-content";
import { BillContentAlt } from "@/components/billing/bill-content-alt";
import { BillContentType3 } from "@/components/billing/bill-content-type3";
import { BillContentType4 } from "@/components/billing/bill-content-type4";
import { BillContentType8 } from "@/components/billing/bill-content-type8";
import { BillContentBakery } from "@/components/billing/bill-content-bakery";
import { BillContentPc } from "@/components/billing/bill-content-pc";
import { BillContentRestaurant } from "@/components/billing/bill-content-restaurant";
import type { BillingCurrency, CartItem, ShopDetails } from "@/types/billing";
import { receiptDocumentLang } from "@/utils/receipt-lang";
import {
  cartForThemedReceipt,
  tenderForThemedTotal,
  totalsForReceiptCart,
  type ThemedReceiptKind,
} from "@/utils/receipt-themed-snapshot";

type ReceiptPreviewProps = {
  receiptNo: string;
  billDate: string;
  billTime: string;
  items: CartItem[];
  shopDetails: ShopDetails;
  subTotal: number;
  tax: number;
  total: number;
  cashReceived: number;
  currency: BillingCurrency;
  previewLocale: "en" | "si";
};

type PreviewVariant = "classic" | "lined" | "ribbon" | "arrow" | "bakery" | "pc" | "restaurant" | "stacked";

const PREVIEW_COLUMNS: readonly { id: string; label: string; variant: PreviewVariant }[] = [
  { id: "t1", label: "T1 · Classic bar", variant: "classic" },
  { id: "t2", label: "T2 · Lined total", variant: "lined" },
  { id: "t3", label: "T3 · Ribbon row", variant: "ribbon" },
  { id: "t4", label: "T4 · Arrow value", variant: "arrow" },
  { id: "t5", label: "T5 · Bakery shop", variant: "bakery" },
  { id: "t6", label: "T6 · PC shop", variant: "pc" },
  { id: "t7", label: "T7 · Restaurant", variant: "restaurant" },
  { id: "t8", label: "T8 · Stacked rows", variant: "stacked" },
];

function themedKind(variant: PreviewVariant): ThemedReceiptKind | null {
  if (variant === "pc") {
    return "pc";
  }
  if (variant === "restaurant") {
    return "restaurant";
  }
  return null;
}

function previewCartForVariant(
  variant: PreviewVariant,
  previewLocale: "en" | "si",
  liveCart: CartItem[],
): CartItem[] {
  const kind = themedKind(variant);
  return kind !== null ? cartForThemedReceipt(kind, previewLocale) : liveCart;
}

type ReceiptBillProps = Omit<ReceiptPreviewProps, "previewLocale">;

export const ReceiptPreview = ({
  receiptNo,
  billDate,
  billTime,
  items,
  shopDetails,
  subTotal,
  tax,
  total,
  cashReceived,
  currency,
  previewLocale,
}: ReceiptPreviewProps) => {
  const receiptLang = receiptDocumentLang(shopDetails, items, previewLocale);

  const renderVariant = (variant: PreviewVariant) => {
    const themed = themedKind(variant) !== null;
    const cart = previewCartForVariant(variant, previewLocale, items);

    let props: ReceiptBillProps;

    if (themed) {
      const totals = totalsForReceiptCart(cart);
      props = {
        receiptNo,
        billDate,
        billTime,
        shopDetails,
        currency,
        items: cart,
        subTotal: totals.subTotal,
        tax: totals.tax,
        total: totals.total,
        cashReceived: tenderForThemedTotal(currency, totals.total, cashReceived),
      };
    } else {
      props = {
        receiptNo,
        billDate,
        billTime,
        shopDetails,
        currency,
        items,
        subTotal,
        tax,
        total,
        cashReceived,
      };
    }

    switch (variant) {
      case "classic":
        return <BillContent {...props} />;
      case "lined":
        return <BillContentAlt {...props} />;
      case "ribbon":
        return <BillContentType3 {...props} />;
      case "arrow":
        return <BillContentType4 {...props} />;
      case "bakery":
        return <BillContentBakery {...props} />;
      case "pc":
        return <BillContentPc {...props} />;
      case "restaurant":
        return <BillContentRestaurant {...props} />;
      case "stacked":
        return <BillContentType8 {...props} />;
      default: {
        const _exhaustive: never = variant;
        return _exhaustive;
      }
    }
  };

  return (
    <div className="flex min-h-0 min-w-0 w-full flex-1 items-start justify-center overflow-x-auto overflow-y-visible bg-zinc-100/80 px-[max(0.75rem,env(safe-area-inset-left))] py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pr-[max(0.75rem,env(safe-area-inset-right))] pt-6 sm:px-4 sm:py-10 lg:border-l lg:border-zinc-200/80 lg:pb-10 lg:pl-4 lg:pr-6 lg:pt-10">
      <div className="mx-auto grid w-full max-w-[120rem] grid-cols-1 justify-items-center gap-x-3 gap-y-8 min-[460px]:grid-cols-2 sm:gap-x-4 sm:gap-y-10 md:grid-cols-4 md:gap-x-6">
        {PREVIEW_COLUMNS.map((col) => (
          <div key={col.id} className="flex w-full max-w-full flex-col items-center">
            <p className="mb-2 max-w-[14rem] text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
              {col.label}
            </p>
            <div
              className="receipt-shell jagged-edge-top jagged-edge-bottom rounded-[5px] border border-zinc-200 bg-white"
              lang={receiptLang}
            >
              {renderVariant(col.variant)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
