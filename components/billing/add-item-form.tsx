import type { ChangeEvent, FormEvent } from "react";
import { Plus } from "lucide-react";

import type { NewItemForm } from "@/types/billing";

type AddItemFormProps = {
  value: NewItemForm;
  onChange: (next: NewItemForm) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export const AddItemForm = ({ value, onChange, onSubmit }: AddItemFormProps) => {
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
    <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h2 className="mb-3 text-lg font-semibold">Add Items</h2>
      <form onSubmit={onSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={value.name}
          onChange={handleTextChange}
          className="w-full rounded border p-2"
          required
        />
        <div className="flex gap-3">
          <input
            type="number"
            name="qty"
            placeholder="Qty"
            min="1"
            value={value.qty}
            onChange={handleTextChange}
            className="w-1/3 rounded border p-2"
            required
          />
          <input
            type="number"
            name="price"
            placeholder="Price (Rs)"
            min="0"
            value={value.price}
            onChange={handleTextChange}
            className="w-2/3 rounded border p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="flex justify-center rounded bg-blue-600 p-2 font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} className="mr-1" /> Add Item
        </button>
      </form>
    </div>
  );
};
