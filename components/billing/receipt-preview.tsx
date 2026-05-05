import { BillContent } from "@/components/billing/bill-content";
import { BillContentAlt } from "@/components/billing/bill-content-alt";
import { BillContentType3 } from "@/components/billing/bill-content-type3";
import type { CartItem, ShopDetails } from "@/types/billing";

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
}: ReceiptPreviewProps) => {
  return (
    <div className="flex min-w-0 flex-1 items-start justify-center overflow-x-auto bg-zinc-100/80 px-3 py-8 sm:py-10 lg:border-l lg:border-zinc-200/80 lg:py-10">
      <div className="flex min-w-max items-start gap-6">
        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs font-semibold text-gray-700">Type 1 Preview</p>
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
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs font-semibold text-gray-700">Type 2 Preview</p>
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
            />
          </div>
        </div>
        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs font-semibold text-gray-700">Type 3 Preview</p>
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};
