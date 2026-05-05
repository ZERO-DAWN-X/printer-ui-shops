import { BillContent } from "@/components/billing/bill-content";
import { BillContentAlt } from "@/components/billing/bill-content-alt";
import { BillContentType3 } from "@/components/billing/bill-content-type3";
import { BillContentType4 } from "@/components/billing/bill-content-type4";
import { BillContentBakery } from "@/components/billing/bill-content-bakery";
import type { BillingCurrency, CartItem, ShopDetails } from "@/types/billing";

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
};

type PreviewVariant = "classic" | "lined" | "ribbon" | "arrow" | "bakery";

const PREVIEW_COLUMNS: readonly { id: string; label: string; variant: PreviewVariant }[] = [
  { id: "t1", label: "T1 · Classic bar", variant: "classic" },
  { id: "t2", label: "T2 · Lined total", variant: "lined" },
  { id: "t3", label: "T3 · Ribbon row", variant: "ribbon" },
  { id: "t4", label: "T4 · Arrow value", variant: "arrow" },
  { id: "t5", label: "T5 · Bakery shop", variant: "bakery" },
  { id: "t6", label: "T6 · Classic bar", variant: "classic" },
  { id: "t7", label: "T7 · Classic bar", variant: "classic" },
  { id: "t8", label: "T8 · Classic bar", variant: "classic" },
];

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
}: ReceiptPreviewProps) => {
  const shared = {
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
  };

  const renderVariant = (variant: PreviewVariant) => {
    switch (variant) {
      case "classic":
        return <BillContent {...shared} />;
      case "lined":
        return <BillContentAlt {...shared} />;
      case "ribbon":
        return <BillContentType3 {...shared} />;
      case "arrow":
        return <BillContentType4 {...shared} />;
      case "bakery":
        return <BillContentBakery {...shared} />;
      default: {
        const _exhaustive: never = variant;
        return _exhaustive;
      }
    }
  };

  return (
    <div className="flex min-w-0 flex-1 items-start justify-center overflow-x-auto bg-zinc-100/80 px-3 py-8 sm:py-10 lg:border-l lg:border-zinc-200/80 lg:py-10">
      <div className="grid w-full max-w-[120rem] grid-cols-2 justify-items-center gap-x-3 gap-y-8 sm:grid-cols-4 sm:gap-x-4 sm:gap-y-10 md:gap-x-6">
        {PREVIEW_COLUMNS.map((col) => (
          <div key={col.id} className="flex w-full max-w-full flex-col items-center">
            <p className="mb-2 max-w-[14rem] text-center text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
              {col.label}
            </p>
            <div className="receipt-shell jagged-edge-top jagged-edge-bottom rounded-[5px] border border-zinc-200 bg-white">
              {renderVariant(col.variant)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
