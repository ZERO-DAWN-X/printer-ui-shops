import type { ChangeEvent } from "react";

import type { ShopDetails } from "@/types/billing";

type ShopDetailsFormProps = {
  values: ShopDetails;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const ShopDetailsForm = ({ values, onChange }: ShopDetailsFormProps) => {
  return (
    <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h2 className="mb-3 text-lg font-semibold">Shop Details</h2>
      <div className="grid grid-cols-1 gap-3">
        <input
          type="text"
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="Shop Name"
          className="w-full rounded border p-2"
        />
        <input
          type="text"
          name="address"
          value={values.address}
          onChange={onChange}
          placeholder="Address"
          className="w-full rounded border p-2"
        />
        <input
          type="text"
          name="phone"
          value={values.phone}
          onChange={onChange}
          placeholder="Phone Number"
          className="w-full rounded border p-2"
        />
        <input
          type="text"
          name="thankYouMessage"
          value={values.thankYouMessage}
          onChange={onChange}
          placeholder="Thank You Message"
          className="w-full rounded border p-2"
        />
      </div>
    </div>
  );
};
