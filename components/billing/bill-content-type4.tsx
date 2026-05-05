import type { BillContentAltProps } from "@/components/billing/bill-content-alt";
import { BillContentAlt } from "@/components/billing/bill-content-alt";

/** Type 2 layout (lined subtotal/tax rules) + ribbon TOTAL bar. */
export const BillContentType4 = (props: Omit<BillContentAltProps, "totalStyle">) => (
  <BillContentAlt {...props} totalStyle="ribbon" />
);
