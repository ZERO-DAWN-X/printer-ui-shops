import type { CartItem } from "@/types/billing";
import {
  receiptStackedGridGapClass,
  receiptStackedGridTemplateClass,
  receiptStackedNameClass,
  receiptStackedQtyClass,
  receiptStackedRowClass,
  receiptStackedValueClass,
} from "@/components/billing/receipt-typography";

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
    <div className={`${receiptStackedRowClass} ${receiptStackedGridTemplateClass} ${receiptStackedGridGapClass}`}>
      <div className={receiptStackedNameClass}>{item.name}</div>
      <span className={receiptStackedQtyClass}>{item.qty}</span>
      <span className={`col-start-3 ${receiptStackedValueClass}`}>
        {formatReceiptAmount(item.price)}
      </span>
      <span className={`col-start-4 ${receiptStackedValueClass}`}>
        {formatReceiptAmount(item.price)}
      </span>
      <span className={`col-start-5 ${receiptStackedValueClass}`}>
        {formatReceiptAmount(lineTotal)}
      </span>
    </div>
  );
}
