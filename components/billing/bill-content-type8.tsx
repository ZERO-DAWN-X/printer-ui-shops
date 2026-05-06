import type { BillContentProps } from "@/components/billing/bill-content";
import { BillContent } from "@/components/billing/bill-content";

/** Type 8 layout: item name line + next line with qty/price/amount values. */
export const BillContentType8 = (props: Omit<BillContentProps, "itemVariant">) => (
  <BillContent {...props} itemVariant="stacked" />
);
