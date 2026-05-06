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
 * - line 1: item label only (full width)
 * - line 2: values right-aligned in same column widths as the header row
 */
export function ReceiptItemRowType8({ item }: ReceiptItemRowType8Props) {
  const lineTotal = item.qty * item.price;

  return (
    <div className="receipt-item mb-1">
      <div className="wrap-break-word text-[13px] font-semibold leading-snug text-black">
        {item.name}
      </div>
      <div className="mt-0.5 flex items-baseline justify-end gap-x-2 font-mono text-[12px] leading-snug tabular-nums text-black/85">
        <span className="w-12 text-right">{item.qty}</span>
        <span className="w-16 text-right">{formatReceiptAmount(item.price)}</span>
        <span className="w-16 text-right">{formatReceiptAmount(item.price)}</span>
        <span className="w-17 text-right">{formatReceiptAmount(lineTotal)}</span>
      </div>
    </div>
  );
}
