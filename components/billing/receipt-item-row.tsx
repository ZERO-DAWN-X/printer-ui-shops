import type { CartItem } from "@/types/billing";

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
    <div className="receipt-item mb-1.5 flex items-start gap-2 text-[12px] leading-snug">
      <div className="min-w-0 flex-1">
        <div className="wrap-break-word font-sans text-[13px] font-semibold leading-snug">
          <span className="text-black">{primary}</span>
          <span className="text-[11px] font-medium text-black/55">
            {" "}
            ({insideParens})
          </span>
        </div>
      </div>
      <span className="w-16 shrink-0 pt-0.5 text-right font-mono text-[12px] tabular-nums leading-none text-black">
        {lineTotal}
      </span>
    </div>
  );
}
