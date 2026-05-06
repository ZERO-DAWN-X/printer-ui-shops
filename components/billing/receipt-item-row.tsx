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
    <div className="receipt-item mb-1.5 flex items-end gap-2 text-[13px] leading-snug">
      <div className="min-w-0 flex-1">
        <div className="break-words font-sans text-[14px] font-semibold leading-snug">
          <span className="text-black">{primary}</span>
          <span className="text-[12px] font-medium text-black/55">
            {" "}
            ({insideParens})
          </span>
        </div>
      </div>
      <span className="w-[4.25rem] shrink-0 self-end pb-px text-right font-mono text-[13px] tabular-nums leading-none text-black">
        {lineTotal}
      </span>
    </div>
  );
}
