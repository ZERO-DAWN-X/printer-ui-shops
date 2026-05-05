import type { ChangeEvent } from "react";

import { SettingsSection, billingInputClass, billingLabelClass } from "@/components/billing/settings-section";
import type { ShopDetails } from "@/types/billing";

type ShopDetailsFormProps = {
  values: ShopDetails;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const ShopDetailsForm = ({ values, onChange }: ShopDetailsFormProps) => {
  return (
    <SettingsSection title="Store profile" description="Header + footer on the receipt.">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
        <div className="sm:col-span-2">
          <label htmlFor="shop-name" className={billingLabelClass}>
            Shop name
          </label>
          <input
            id="shop-name"
            type="text"
            name="name"
            value={values.name}
            onChange={onChange}
            placeholder="Shop name"
            className={billingInputClass}
            autoComplete="organization"
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="shop-address" className={billingLabelClass}>
            Address
          </label>
          <input
            id="shop-address"
            type="text"
            name="address"
            value={values.address}
            onChange={onChange}
            placeholder="Street, city"
            className={billingInputClass}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="shop-phone" className={billingLabelClass}>
            Phone
          </label>
          <input
            id="shop-phone"
            type="tel"
            name="phone"
            value={values.phone}
            onChange={onChange}
            placeholder="+94 …"
            className={billingInputClass}
            autoComplete="tel"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="shop-thanks" className={billingLabelClass}>
            Footer message
          </label>
          <input
            id="shop-thanks"
            type="text"
            name="thankYouMessage"
            value={values.thankYouMessage}
            onChange={onChange}
            placeholder="Thank you line"
            className={billingInputClass}
          />
        </div>
      </div>
    </SettingsSection>
  );
};
