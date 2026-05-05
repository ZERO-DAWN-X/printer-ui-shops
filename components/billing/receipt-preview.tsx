import { BillContent } from "@/components/billing/bill-content";
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
    <div className="flex w-full justify-center items-start overflow-x-auto px-2 py-10 md:w-1/2">
      <div className="flex flex-col items-center">
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
    </div>
  );
};
