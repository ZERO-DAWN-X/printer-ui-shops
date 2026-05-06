import type { ChangeEvent, FormEvent } from "react";
import { Plus } from "lucide-react";

import { SettingsSection, billingInputClass, billingLabelClass } from "@/components/billing/settings-section";
import type { NewItemForm } from "@/types/billing";

type AddItemFormProps = {
  value: NewItemForm;
  onChange: (next: NewItemForm) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  /** Label segment after "Price", e.g. "Rs." → "Price (Rs.)" or "$" → "Price ($)" */
  priceUnitShort?: string;
};

export const AddItemForm = ({ value, onChange, onSubmit, priceUnitShort = "Rs." }: AddItemFormProps) => {
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
      <form
        onSubmit={onSubmit}
        className="grid grid-cols-1 gap-x-2 gap-y-2 min-[560px]:grid-cols-[minmax(0,1fr)_4.75rem_minmax(5.75rem,1fr)_auto] min-[560px]:items-end"
      >
        <div className="min-w-0">
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
            autoComplete="off"
          />
        </div>
        <div className="min-w-0">
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
        <div className="min-w-0">
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
        <div className="min-w-0 min-[560px]:w-[min(100%,8.75rem)] min-[560px]:shrink-0">
          <span className={billingLabelClass + " invisible select-none"} aria-hidden>
            Add
          </span>
          <button
            type="submit"
            className="flex min-h-10 w-full touch-manipulation items-center justify-center gap-1.5 rounded-[5px] bg-zinc-900 text-[11px] font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 sm:h-8 sm:min-h-8 sm:text-xs sm:font-medium lg:ring-offset-1"
          >
            <Plus size={16} strokeWidth={2} aria-hidden className="shrink-0" />
            Add
          </button>
        </div>
      </form>
    </SettingsSection>
  );
};
