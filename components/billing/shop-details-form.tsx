import type { ChangeEvent } from "react";

import {
  SettingsSection,
  billingInputClass,
  billingLabelClass,
  billingTextAreaClass,
} from "@/components/billing/settings-section";
import type { ShopDetails } from "@/types/billing";

type ShopDetailsFormProps = {
  values: ShopDetails;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export const ShopDetailsForm = ({ values, onChange }: ShopDetailsFormProps) => {
  return (
    <SettingsSection title="Store profile" description="Header + footer on the receipt.">
      <div className="grid grid-cols-1 gap-x-2 gap-y-1.5 sm:grid-cols-2 sm:gap-x-2 sm:gap-y-2 md:gap-x-3">
        <div className="sm:col-span-2">
          <label htmlFor="shop-name" className={billingLabelClass}>
            Shop name <span className="font-normal text-zinc-400">(T1–T4, T7–T8)</span>
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
        <div className="sm:col-span-2">
          <label htmlFor="shop-bakery-name" className={billingLabelClass}>
            Bakery name <span className="font-normal text-zinc-400">(Type 5 only)</span>
          </label>
          <input
            id="shop-bakery-name"
            type="text"
            name="bakeryShopName"
            value={values.bakeryShopName}
            onChange={onChange}
            placeholder="Separate title for bakery layout"
            className={billingInputClass}
            autoComplete="off"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="shop-pc-name" className={billingLabelClass}>
            PC shop name <span className="font-normal text-zinc-400">(Type 6 only)</span>
          </label>
          <input
            id="shop-pc-name"
            type="text"
            name="pcShopName"
            value={values.pcShopName}
            onChange={onChange}
            placeholder="Title on PC-shop receipt header"
            className={billingInputClass}
            autoComplete="off"
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
          <label htmlFor="shop-opening-hours" className={billingLabelClass}>
            Opening hours <span className="font-normal text-zinc-400">(Type 5 / 6)</span>
          </label>
          <input
            id="shop-opening-hours"
            type="text"
            name="openingHours"
            value={values.openingHours}
            onChange={onChange}
            placeholder="e.g. Mon–Sun 7–9"
            className={billingInputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="shop-bakery-note" className={billingLabelClass}>
            Bakery note <span className="font-normal text-zinc-400">(Type 5 header)</span>
          </label>
          <textarea
            id="shop-bakery-note"
            name="bakeryNote"
            value={values.bakeryNote}
            onChange={onChange}
            rows={2}
            placeholder="Specialties, registration, delivery…"
            className={billingTextAreaClass}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="shop-pc-note" className={billingLabelClass}>
            PC shop note <span className="font-normal text-zinc-400">(Type 6 header)</span>
          </label>
          <textarea
            id="shop-pc-note"
            name="pcShopNote"
            value={values.pcShopNote}
            onChange={onChange}
            rows={2}
            placeholder="Parts, builds, diagnostics…"
            className={billingTextAreaClass}
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
