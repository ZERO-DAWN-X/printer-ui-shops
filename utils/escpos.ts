import type { ReceiptPayload } from "@/types/thermal";

const ESC = "\x1B";
const GS = "\x1D";
const MAX_CHARS_PER_LINE = 32;

const cleanText = (value: string): string => value.replace(/[\r\n\t]+/g, " ").trim();

const padRight = (value: string, width: number): string => {
  const trimmed = cleanText(value);
  if (trimmed.length >= width) {
    return trimmed.slice(0, width);
  }
  return trimmed.padEnd(width, " ");
};

const twoCol = (left: string, right: string): string => {
  const safeLeft = cleanText(left);
  const safeRight = cleanText(right);
  const leftWidth = Math.max(1, MAX_CHARS_PER_LINE - safeRight.length);
  return `${safeLeft.slice(0, leftWidth).padEnd(leftWidth, " ")}${safeRight}`;
};

const itemLine = (name: string, qty: number, amount: number): string => {
  const qtyText = String(qty).padStart(3, " ");
  const amountText = amount.toFixed(2).padStart(9, " ");
  const nameWidth = MAX_CHARS_PER_LINE - qtyText.length - amountText.length;
  return `${padRight(name, nameWidth)}${qtyText}${amountText}`;
};

export const buildEscPosReceipt = (payload: ReceiptPayload): string => {
  const lines: string[] = [];

  lines.push(`${ESC}@`); // Initialize
  lines.push(`${ESC}a\x01`); // Center
  lines.push(`${ESC}E\x01${cleanText(payload.shopDetails.name)}\n${ESC}E\x00`);
  lines.push(`${cleanText(payload.shopDetails.address)}\n`);
  lines.push(`Tel: ${cleanText(payload.shopDetails.phone)}\n`);

  lines.push(`${ESC}a\x00`);
  lines.push("--------------------------------\n");
  lines.push(`${twoCol("Receipt", `#${payload.receiptNo}`)}\n`);
  lines.push(`${twoCol("Date", payload.billDate)}\n`);
  lines.push(`${twoCol("Time", payload.billTime)}\n`);
  lines.push("--------------------------------\n");
  lines.push(`${padRight("ITEM", 20)}${"QTY".padStart(3, " ")}${"AMOUNT".padStart(9, " ")}\n`);
  lines.push("--------------------------------\n");

  payload.items.forEach((item) => {
    lines.push(`${itemLine(item.name, item.qty, item.qty * item.price)}\n`);
  });

  lines.push("--------------------------------\n");
  lines.push(`${twoCol("Sub Total", payload.subTotal.toFixed(2))}\n`);
  lines.push(`${twoCol("Tax", payload.tax.toFixed(2))}\n`);
  lines.push(`${ESC}E\x01${twoCol("TOTAL", `Rs ${payload.total.toFixed(2)}`)}\n${ESC}E\x00`);
  lines.push("--------------------------------\n");
  lines.push(`${ESC}a\x01${cleanText(payload.shopDetails.thankYouMessage)}\n`);
  lines.push("\n");
  lines.push(`${cleanText("SYSTEM BY ZERO SOLUTION")}\n`);
  lines.push(`${cleanText("TEL: 0701337419")}\n`);
  lines.push(`${ESC}a\x00`);
  lines.push("\n\n\n");
  lines.push(`${GS}V\x41\x03`); // Feed + partial cut

  return lines.join("");
};
