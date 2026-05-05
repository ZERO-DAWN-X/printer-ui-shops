import { BillContent } from "@/components/billing/bill-content";
import { BillContentAlt } from "@/components/billing/bill-content-alt";
import { BillContentType3 } from "@/components/billing/bill-content-type3";
import { BillContentType4 } from "@/components/billing/bill-content-type4";
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
  return (
    <div className="flex min-w-0 flex-1 items-start justify-center overflow-x-auto bg-zinc-100/80 px-3 py-8 sm:py-10 lg:border-l lg:border-zinc-200/80 lg:py-10">
      <div className="grid w-full max-w-[120rem] grid-cols-2 justify-items-center gap-x-4 gap-y-8 md:grid-cols-4 md:gap-x-6">
        <div className="flex flex-col items-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
            T1 · Classic bar
          </p>
          <div className="receipt-shell jagged-edge-top jagged-edge-bottom rounded-[5px] border border-zinc-200 bg-white">
            <BillContent
              receiptNo={receiptNo}
              billDate={billDate}
              billTime={billTime}
              items={items}
              shopDetails={shopDetails}
              subTotal={subTotal}
              tax={tax}
              total={total}
              cashReceived={cashReceived}
              currency={currency}
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
            T2 · Lined total
          </p>
          <div className="receipt-shell jagged-edge-top jagged-edge-bottom rounded-[5px] border border-zinc-200 bg-white">
            <BillContentAlt
              receiptNo={receiptNo}
              billDate={billDate}
              billTime={billTime}
              items={items}
              shopDetails={shopDetails}
              subTotal={subTotal}
              tax={tax}
              total={total}
              cashReceived={cashReceived}
              currency={currency}
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
            T3 · Ribbon row
          </p>
          <div className="receipt-shell jagged-edge-top jagged-edge-bottom rounded-[5px] border border-zinc-200 bg-white">
            <BillContentType3
              receiptNo={receiptNo}
              billDate={billDate}
              billTime={billTime}
              items={items}
              shopDetails={shopDetails}
              subTotal={subTotal}
              tax={tax}
              total={total}
              cashReceived={cashReceived}
              currency={currency}
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
            T4 · Arrow value
          </p>
          <div className="receipt-shell jagged-edge-top jagged-edge-bottom rounded-[5px] border border-zinc-200 bg-white">
            <BillContentType4
              receiptNo={receiptNo}
              billDate={billDate}
              billTime={billTime}
              items={items}
              shopDetails={shopDetails}
              subTotal={subTotal}
              tax={tax}
              total={total}
              cashReceived={cashReceived}
              currency={currency}
            />
          </div>
        </div>
        <div className="col-span-2 flex flex-col items-center md:col-span-4">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
            T5 · Classic bar
          </p>
          <div className="receipt-shell jagged-edge-top jagged-edge-bottom rounded-[5px] border border-zinc-200 bg-white">
            <BillContent
              receiptNo={receiptNo}
              billDate={billDate}
              billTime={billTime}
              items={items}
              shopDetails={shopDetails}
              subTotal={subTotal}
              tax={tax}
              total={total}
              cashReceived={cashReceived}
              currency={currency}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
