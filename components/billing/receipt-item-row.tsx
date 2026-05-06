import type { CartItem } from "@/types/billing";
import {
  receiptItemAmountClass,
  receiptItemPrimaryClass,
  receiptItemRowWrapperClass,
  receiptItemSecondaryClass,
} from "@/components/billing/receipt-typography";

function splitItemPrimaryAndEnglish(fullName: string): { primary: string; englishParen?: string } {
  const m = fullName.match(/^\s*(.+?)\s*(\([^)]+\))\s*$/);
  if (!m?.[2]) {
    return { primary: fullName.trim() };
  }
  return { primary: (m[1] ?? "").trim(), englishParen: (m[2] ?? "").trim() };
}

function stripOuterParens(segment: string): string {
  const m = segment.match(/^\(([\s\S]*)\)$/);
  return m ? (m[1] ?? "").trim() : segment.trim();
}

type ReceiptItemRowProps = {
  item: CartItem;
};

/** One pair of parentheses for hint + unit breakdown (e.g. `Name (1 gal, 6.79 x 1)`). */
export function ReceiptItemRow({ item }: ReceiptItemRowProps) {
  const { primary, englishParen } = splitItemPrimaryAndEnglish(item.name);
  const lineTotal = (item.qty * item.price).toFixed(2);
  const formulaPart = `${item.price.toFixed(2)} x ${item.qty}`;
  const insideParens = englishParen
    ? `${stripOuterParens(englishParen)}, ${formulaPart}`
    : formulaPart;

  return (
    <div className={receiptItemRowWrapperClass}>
      <div className="min-w-0 flex-1">
        <div className={receiptItemPrimaryClass}>
          <span className="text-black">{primary}</span>
          <span className={receiptItemSecondaryClass}>
            {" "}
            ({insideParens})
          </span>
        </div>
      </div>
      <span className={receiptItemAmountClass}>
        {lineTotal}
      </span>
    </div>
  );
}
