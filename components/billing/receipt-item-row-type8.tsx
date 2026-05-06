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
      <div className="flex items-baseline justify-end gap-x-2 text-[13px] font-normal leading-snug tabular-nums">
        <span
          className="w-12 text-center"
          style={{
            color: "#737373",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          {item.qty}
        </span>
        <span
          className="w-17 text-center"
          style={{
            color: "#737373",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          <span className="relative inline-block">
            {formatReceiptAmount(listed)}
            {listed > item.price ? (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 top-1/2 h-px"
                style={{
                  backgroundColor: "#000",
                  transform: "translateY(-50%) rotate(12deg)",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              />
            ) : null}
          </span>
        </span>
        <span
          className="w-17 text-center"
          style={{
            color: "#737373",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          {formatReceiptAmount(item.price)}
        </span>
        <span className="w-17 text-center font-extrabold text-black">
          {formatReceiptAmount(lineTotal)}
        </span>
      </div>
    </div>
  );
}
