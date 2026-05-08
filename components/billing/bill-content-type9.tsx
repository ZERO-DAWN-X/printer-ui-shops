import type { BillContentProps } from "@/components/billing/bill-content";
import { BillContent } from "@/components/billing/bill-content";

/**
 * Type 9 — same layout, sizes and structure as T8 (stacked rows),
 * but driven by the bakery shop info (bakeryShopName / bakeryAddress / bakeryPhone)
 * and topped with the bakery logo from /public/bakery.svg.
 */
export const BillContentType9 = (props: Omit<BillContentProps, "itemVariant">) => {
  const { shopDetails } = props;
  const bakeryShopDetails = {
    ...shopDetails,
    name: shopDetails.bakeryShopName.trim() || shopDetails.name,
    address: shopDetails.bakeryAddress.trim() || shopDetails.address,
    phone: shopDetails.bakeryPhone.trim() || shopDetails.phone,
  };

  return (
    <BillContent
      {...props}
      shopDetails={bakeryShopDetails}
      itemVariant="stacked-classic"
      logo={
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/bakery.svg"
          alt=""
          aria-hidden
          className="block h-20 w-auto"
          style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
        />
      }
    />
  );
};
