"use client";

import { useId, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Printer, Settings } from "lucide-react";

import { AddItemForm } from "@/components/billing/add-item-form";
import { BillContent } from "@/components/billing/bill-content";
import { PrintHint } from "@/components/billing/print-hint";
import { ReceiptPreview } from "@/components/billing/receipt-preview";
import { ShopDetailsForm } from "@/components/billing/shop-details-form";
import { DEFAULT_ITEMS, DEFAULT_SHOP_DETAILS } from "@/data/mock-billing";
import type { CartItem, NewItemForm, ShopDetails } from "@/types/billing";
import { calculateSubtotal, generateReceiptFromSeed } from "@/utils/billing";

const INITIAL_NEW_ITEM: NewItemForm = { name: "", qty: 1, price: "" };

type BillingAppProps = {
  initialBillDate: string;
  initialBillTime: string;
};

export const BillingApp = ({
  initialBillDate,
  initialBillTime,
}: BillingAppProps) => {
  const [shopDetails, setShopDetails] = useState<ShopDetails>(DEFAULT_SHOP_DETAILS);
  const [items, setItems] = useState<CartItem[]>(DEFAULT_ITEMS);
  const [newItem, setNewItem] = useState<NewItemForm>(INITIAL_NEW_ITEM);
  const [showPrintHint, setShowPrintHint] = useState(false);
  const receiptSeed = useId();
  const receiptNo = useMemo(() => generateReceiptFromSeed(receiptSeed), [receiptSeed]);

  const subTotal = useMemo(() => calculateSubtotal(items), [items]);
  const tax = 0;
  const total = subTotal + tax;

  const handleAddItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newItem.name.trim() || !newItem.price) {
      return;
    }

    setItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now(),
        name: newItem.name.trim(),
        qty: Number(newItem.qty),
        price: Number(newItem.price),
      },
    ]);
    setNewItem(INITIAL_NEW_ITEM);
  };

  const handleRemoveItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleShopDetailsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setShopDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = () => {
    setShowPrintHint(true);
    window.setTimeout(() => {
      try {
        window.print();
      } catch (error) {
        console.error("Printing failed or blocked by environment", error);
      }
    }, 500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');

        .print-only { display: none; }
        .thermal-dash { border-bottom: 1.5px dashed black !important; }

        @media print {
          .no-print { display: none !important; }

          .print-only {
            display: block !important;
            position: static !important;
            width: 80mm;
            box-sizing: border-box;
            background-color: white;
            color: black;
            padding: 3mm 3mm 5mm;
            margin: 0 auto;
            break-inside: auto;
            page-break-inside: auto;
          }

          @page {
            size: 80mm auto;
            margin: 0;
          }

          body, html {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
            min-height: auto !important;
            height: auto !important;
            overflow: visible !important;
          }

          body {
            display: block !important;
          }

          .print-only,
          .print-only > * {
            break-after: auto;
            page-break-after: auto;
            break-before: auto;
            page-break-before: auto;
          }
        }

        .jagged-edge-top { position: relative; }
        .jagged-edge-top::before {
          content: "";
          position: absolute;
          top: -4px;
          left: 0;
          right: 0;
          height: 4px;
          background-image: linear-gradient(135deg, transparent 50%, white 50%), linear-gradient(225deg, transparent 50%, white 50%);
          background-size: 8px 100%;
          background-position: left top;
          z-index: 10;
        }
        .jagged-edge-bottom { position: relative; }
        .jagged-edge-bottom::after {
          content: "";
          position: absolute;
          bottom: -4px;
          left: 0;
          right: 0;
          height: 4px;
          background-image: linear-gradient(135deg, white 50%, transparent 50%), linear-gradient(225deg, white 50%, transparent 50%);
          background-size: 8px 100%;
          background-position: left bottom;
          z-index: 10;
        }
      `}</style>

      <div
        className="no-print min-h-screen flex flex-col bg-[#e8eaed] text-gray-800 md:flex-row"
        style={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}
      >
        <div className="z-20 w-full overflow-y-auto border-r border-gray-300 bg-white p-6 shadow-lg md:w-1/2">
          <h1 className="mb-6 flex items-center text-2xl font-bold text-blue-600">
            <Settings className="mr-2" /> Bill Settings
          </h1>

          <ShopDetailsForm values={shopDetails} onChange={handleShopDetailsChange} />
          <AddItemForm value={newItem} onChange={setNewItem} onSubmit={handleAddItem} />

          <button
            type="button"
            onClick={handlePrint}
            className="flex w-full justify-center rounded-xl bg-black p-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-gray-800"
          >
            <Printer className="mr-2" /> Print Bill
          </button>

          {showPrintHint ? <PrintHint /> : null}
        </div>

        <ReceiptPreview
          receiptNo={receiptNo}
          billDate={initialBillDate}
          billTime={initialBillTime}
          items={items}
          shopDetails={shopDetails}
          subTotal={subTotal}
          tax={tax}
          total={total}
          onRemoveItem={handleRemoveItem}
        />
      </div>

      <div
        className="print-only"
        style={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}
      >
        <BillContent
          isPreview={false}
          receiptNo={receiptNo}
          billDate={initialBillDate}
          billTime={initialBillTime}
          items={items}
          shopDetails={shopDetails}
          subTotal={subTotal}
          tax={tax}
          total={total}
        />
      </div>
    </>
  );
};
