import type { CartItem } from "@/types/billing";

type ReceiptItemRowType8Props = {
  item: CartItem;
};

function formatReceiptAmount(value: number): string {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * Type 8 row style:
 * - line 1: item label only
 * - line 2: values only (qty, price, amount)
 */
export function ReceiptItemRowType8({ item }: ReceiptItemRowType8Props) {
  const lineTotal = item.qty * item.price;

  return (
    <div className="receipt-item mb-1.5 grid grid-cols-[minmax(0,1fr)_3rem_4rem_4rem_4rem] items-center gap-x-2 text-[13px] leading-snug">
      <div className="col-span-5 wrap-break-word text-black">{item.name}</div>
      <span className="col-start-2 mt-0.5 text-left font-mono text-[12px] tabular-nums text-black/90">{item.qty}</span>
      <span className="col-start-3 mt-0.5 text-left font-mono text-[12px] tabular-nums text-black/90">
        {formatReceiptAmount(item.price)}
      </span>
      <span className="col-start-4 mt-0.5 text-left font-mono text-[12px] tabular-nums text-black/90">
        {formatReceiptAmount(item.price)}
      </span>
      <span className="col-start-5 mt-0.5 text-left font-mono text-[12px] tabular-nums text-black/90">
        {formatReceiptAmount(lineTotal)}
      </span>
    </div>
  );
}
