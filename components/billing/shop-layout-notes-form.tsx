import type { ChangeEvent } from "react";

import {
  SettingsSection,
  billingInputClass,
  billingLabelClass,
  billingTextAreaClass,
} from "@/components/billing/settings-section";
import type { ShopDetails } from "@/types/billing";

type ShopLayoutNotesFormProps = {
  values: ShopDetails;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

/** Bakery · PC · Restaurant header copy — grouped with Line items column on wide layouts */
export const ShopLayoutNotesForm = ({ values, onChange }: ShopLayoutNotesFormProps) => {
  return (
    <SettingsSection
      title="Layout notes"
      description="Extras on typed receipts — bakery (T5), PC (T6), restaurant (T7)."
    >
      <div className="grid min-w-0 grid-cols-1 gap-x-2 gap-y-1.5 sm:gap-x-2 sm:gap-y-2">
        <div>
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
        <div>
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
        <div>
          <label htmlFor="shop-restaurant-name" className={billingLabelClass}>
            Restaurant name <span className="font-normal text-zinc-400">(Type 7 only)</span>
          </label>
          <input
            id="shop-restaurant-name"
            type="text"
            name="restaurantShopName"
            value={values.restaurantShopName}
            onChange={onChange}
            placeholder="Title on restaurant receipt"
            className={billingInputClass}
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="shop-restaurant-note" className={billingLabelClass}>
            Restaurant note <span className="font-normal text-zinc-400">(Type 7 header)</span>
          </label>
          <textarea
            id="shop-restaurant-note"
            name="restaurantNote"
            value={values.restaurantNote}
            onChange={onChange}
            rows={2}
            placeholder="Cuisines, lunch specials, reservations…"
            className={billingTextAreaClass}
          />
        </div>
      </div>
    </SettingsSection>
  );
};
