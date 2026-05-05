import { Trash2 } from "lucide-react";

import type { CartItem, ShopDetails } from "@/types/billing";
import { Barcode } from "@/components/billing/barcode";

type BillContentProps = {
  isPreview: boolean;
  receiptNo: string;
  billDate: string;
  billTime: string;
  items: CartItem[];
  shopDetails: ShopDetails;
  subTotal: number;
  tax: number;
  total: number;
  onRemoveItem?: (id: number) => void;
};

export const BillContent = ({
  isPreview,
  receiptNo,
  billDate,
  billTime,
  items,
  shopDetails,
  subTotal,
  tax,
  total,
  onRemoveItem,
}: BillContentProps) => {
  const barcodeValue = `${receiptNo}000${items.length}`;

  return (
    <div className="receipt-content">
      <div className="mb-3 text-center">
        <h1 className="text-2xl font-bold tracking-tight">{shopDetails.name}</h1>
        <p className="mt-1 text-[13px]">{shopDetails.address}</p>
        <p className="text-[13px]">Tel: {shopDetails.phone}</p>
      </div>

      <div className="mb-2 text-[13px]">
        <div className="flex justify-between">
          <span>Receipt :</span>
          <span>#{receiptNo}</span>
        </div>
        <div className="flex justify-between">
          <span>Cashier :</span>
          <span>Admin</span>
        </div>
        <div className="flex justify-between">
          <span>Date :</span>
          <span>{billDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Time :</span>
          <span>{billTime}</span>
        </div>
      </div>

      <div className="thermal-dash my-2 border-b-[1.5px] border-dashed border-black" />

      <div className="mb-1 flex text-[13px] font-bold uppercase">
        <span className="w-1/2">Item</span>
        <span className="w-1/4 text-center">Qty</span>
        <span className="w-1/4 text-right">Amount</span>
      </div>

      <div className="thermal-dash mb-2 border-b-[1.5px] border-dashed border-black" />

      <div className="min-h-[40px]">
        {items.length === 0 ? (
          <div className="py-4 text-center text-sm text-gray-400">No items added</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="group relative mb-1.5 flex text-[13px]">
              <span className="w-1/2 pr-1">{item.name}</span>
              <span className="w-1/4 text-center">{item.qty}</span>
              <span className="w-1/4 text-right">{(item.qty * item.price).toFixed(2)}</span>

              {isPreview && onRemoveItem ? (
                <button
                  type="button"
                  onClick={() => onRemoveItem(item.id)}
                  className="absolute -right-8 top-0 hidden rounded bg-red-100 p-1 text-red-500 group-hover:block"
                  title="Remove Item"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 size={16} />
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>

      <div className="thermal-dash mt-2 mb-2 border-b-[1.5px] border-dashed border-black" />

      <div>
        <div className="flex justify-between text-[13px]">
          <span>Sub Total:</span>
          <span>{subTotal.toFixed(2)}</span>
        </div>
        <div className="mb-1 flex justify-between text-[13px]">
          <span>Tax:</span>
          <span>{tax.toFixed(2)}</span>
        </div>
        <div className="thermal-dash mt-1 flex justify-between border-t-[1.5px] border-dashed border-black pt-1 text-lg font-black">
          <span>TOTAL:</span>
          <span>Rs {total.toFixed(2)}</span>
        </div>
      </div>

      <div className="thermal-dash mt-2 mb-3 border-b-[1.5px] border-dashed border-black" />

      <div className="mb-2 text-center text-[13px] font-bold">
        <p>{shopDetails.thankYouMessage}</p>
      </div>

      <Barcode code={barcodeValue} />

      <div className="thermal-dash mt-4 flex flex-col items-center border-t-[1.5px] border-dashed border-black pt-3 text-xs font-bold">
        <span className="uppercase">System by Zero Solution</span>
        <span className="mt-0.5 tracking-wider">TEL: 0701337419</span>
      </div>
    </div>
  );
};
