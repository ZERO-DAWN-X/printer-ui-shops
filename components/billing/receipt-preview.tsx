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
  onRemoveItem: (id: number) => void;
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
  onRemoveItem,
}: ReceiptPreviewProps) => {
  return (
    <div className="w-full py-10 md:w-1/2 flex justify-center items-start overflow-y-auto">
      <div className="flex flex-col items-center">
        <div
          className="jagged-edge-top jagged-edge-bottom bg-white p-4 text-black leading-snug shadow-2xl"
          style={{ width: "80mm", paddingBottom: "20px" }}
        >
          <BillContent
            isPreview
            receiptNo={receiptNo}
            billDate={billDate}
            billTime={billTime}
            items={items}
            shopDetails={shopDetails}
            subTotal={subTotal}
            tax={tax}
            total={total}
            onRemoveItem={onRemoveItem}
          />
        </div>
      </div>
    </div>
  );
};
