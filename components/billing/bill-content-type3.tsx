import type { BillContentProps } from "@/components/billing/bill-content";
import { BillContent } from "@/components/billing/bill-content";

/** Same as Type 1 except the TOTAL row uses a ribbon-style (pointed) banner. */
export const BillContentType3 = (props: BillContentProps) => (
  <BillContent {...props} totalVariant="ribbon" />
);
