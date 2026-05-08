import type { BillContentProps } from "@/components/billing/bill-content";
import { BillContent } from "@/components/billing/bill-content";

/** Type 8 layout: item name line + next line with qty/price/amount values. Topped with the grocery logo. */
export const BillContentType8 = (props: Omit<BillContentProps, "itemVariant">) => (
  <BillContent
    {...props}
    itemVariant="stacked"
    logo={
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/grocery.png"
        alt=""
        aria-hidden
        className="block h-20 w-auto"
        style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
      />
    }
  />
);
