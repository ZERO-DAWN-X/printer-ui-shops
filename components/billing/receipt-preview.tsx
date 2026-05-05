import { BillContent } from "@/components/billing/bill-content";
import { BillContentAlt } from "@/components/billing/bill-content-alt";
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
    <div className="flex w-full items-start justify-center overflow-x-auto px-2 py-10 md:w-1/2">
      <div className="flex min-w-max items-start gap-6">
        <div className="flex flex-col items-center">
          <p className="mb-2 text-xs font-semibold text-gray-700">Type 1 Preview</p>
          <div className="receipt-shell jagged-edge-top jagged-edge-bottom shadow-2xl">
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
          <div className="receipt-shell jagged-edge-top jagged-edge-bottom shadow-2xl">
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
      </div>
    </div>
  );
};
