import type { ChangeEvent, FormEvent } from "react";
import { Plus } from "lucide-react";

import { SettingsSection, billingInputClass, billingLabelClass } from "@/components/billing/settings-section";
import type { NewItemForm } from "@/types/billing";

type AddItemFormProps = {
  value: NewItemForm;
  onChange: (next: NewItemForm) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  /** Label segment after "Price", e.g. "Rs" → "Price (Rs)" or "$" → "Price ($)" */
  priceUnitShort?: string;
};

export const AddItemForm = ({ value, onChange, onSubmit, priceUnitShort = "Rs" }: AddItemFormProps) => {
  const handleTextChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value: nextValue } = event.target;
    if (name === "name") {
      onChange({ ...value, name: nextValue });
      return;
    }

    if (name === "qty") {
      onChange({ ...value, qty: Number(nextValue) || 1 });
      return;
    }

    onChange({ ...value, price: nextValue });
  };

  return (
    <SettingsSection title="Line items" description="Add a row — preview updates live.">
      <form onSubmit={onSubmit} className="flex flex-wrap items-end gap-x-2 gap-y-2">
        <div className="min-w-0 basis-full sm:min-w-44 sm:flex-1 sm:basis-[min(100%,16rem)]">
          <label htmlFor="item-name" className={billingLabelClass}>
            Item name
          </label>
          <input
            id="item-name"
            type="text"
            name="name"
            placeholder="Description"
            value={value.name}
            onChange={handleTextChange}
            className={billingInputClass}
            required
          />
        </div>
        <div className="w-19 shrink-0">
          <label htmlFor="item-qty" className={billingLabelClass}>
            Qty
          </label>
          <input
            id="item-qty"
            type="number"
            name="qty"
            placeholder="1"
            min="1"
            value={value.qty}
            onChange={handleTextChange}
            className={billingInputClass}
            required
          />
        </div>
        <div className="min-w-0 w-32 shrink-0 sm:w-31 sm:grow-2">
          <label htmlFor="item-price" className={billingLabelClass}>
            Price ({priceUnitShort})
          </label>
          <input
            id="item-price"
            type="number"
            name="price"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={value.price}
            onChange={handleTextChange}
            className={billingInputClass}
            required
          />
        </div>
        <div className="min-w-27 grow basis-27 sm:max-w-28 sm:grow-0">
          <span className={billingLabelClass + " invisible select-none"} aria-hidden>
            Add
          </span>
          <button
            type="submit"
            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-[5px] bg-zinc-900 text-xs font-medium text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 focus-visible:ring-offset-1"
          >
            <Plus size={16} strokeWidth={2} aria-hidden />
            Add
          </button>
        </div>
      </form>
    </SettingsSection>
  );
};
