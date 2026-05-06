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
 * - line 2: values right-aligned in same column widths as the header row.
 *   Amount is bolder/darker so the eye lands on the line total first;
 *   qty/list/our read as secondary detail.
 */
export function ReceiptItemRowType8({ item }: ReceiptItemRowType8Props) {
  const listed = item.listedPrice ?? item.price;
  const lineTotal = item.qty * item.price;

  return (
    <div className="receipt-item mb-0.5">
      <div className="wrap-break-word text-[13px] font-semibold leading-snug text-black">
        {item.name}
      </div>
      <div className="flex items-baseline justify-end gap-x-2 text-[12px] leading-snug tabular-nums">
        <span className="w-12 text-center text-black/70">{item.qty}</span>
        <span
          className={`w-17 text-center ${
            listed > item.price ? "text-black/55 line-through" : "text-black/70"
          }`}
        >
          {formatReceiptAmount(listed)}
        </span>
        <span className="w-17 text-center text-black/70">{formatReceiptAmount(item.price)}</span>
        <span className="w-17 text-center font-semibold text-black">
          {formatReceiptAmount(lineTotal)}
        </span>
      </div>
    </div>
  );
}
