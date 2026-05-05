"use client";

import { useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Printer, Settings } from "lucide-react";

import { AddItemForm } from "@/components/billing/add-item-form";
import { BillContent } from "@/components/billing/bill-content";
import { BillContentAlt } from "@/components/billing/bill-content-alt";
import { PrintHint } from "@/components/billing/print-hint";
import { ReceiptPreview } from "@/components/billing/receipt-preview";
import { ShopDetailsForm } from "@/components/billing/shop-details-form";
import { DEFAULT_ITEMS, DEFAULT_SHOP_DETAILS } from "@/data/mock-billing";
import type { CartItem, NewItemForm, ShopDetails } from "@/types/billing";
import { calculateSubtotal, generateReceiptFromSeed } from "@/utils/billing";

const INITIAL_NEW_ITEM: NewItemForm = { name: "", qty: 1, price: "" };
const THERMAL_PAPER_WIDTH_MM = 80;
const THERMAL_CONTENT_WIDTH_MM = 72;
const TAX_RATE = 0.05;
type PrintType = "type1" | "type2";

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
  const [cashReceived, setCashReceived] = useState<string>("4000");
  const [printType, setPrintType] = useState<PrintType>("type1");
  const [showPrintHint, setShowPrintHint] = useState(false);
  const printTemplateRef = useRef<HTMLDivElement>(null);
  const receiptSeed = useId();
  const receiptNo = useMemo(() => generateReceiptFromSeed(receiptSeed), [receiptSeed]);

  const subTotal = useMemo(() => calculateSubtotal(items), [items]);
  const taxAmount = useMemo(() => subTotal * TAX_RATE, [subTotal]);
  const total = subTotal + taxAmount;
  const cashReceivedValue = useMemo(() => {
    if (!cashReceived.trim()) {
      return total;
    }
    const value = Number(cashReceived);
    return Number.isFinite(value) && value >= 0 ? value : total;
  }, [cashReceived, total]);

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

  const handleShopDetailsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setShopDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBrowserPrint = () => {
    const printNode = printTemplateRef.current;
    if (!printNode) {
      return;
    }

    const printMarkup = printNode.innerHTML;
    if (!printMarkup) {
      return;
    }

    const measureRoot = document.createElement("div");
    measureRoot.style.position = "fixed";
    measureRoot.style.left = "-100000px";
    measureRoot.style.top = "0";
    measureRoot.style.width = `${THERMAL_PAPER_WIDTH_MM}mm`;
    measureRoot.style.visibility = "hidden";
    measureRoot.style.pointerEvents = "none";
    measureRoot.innerHTML = printMarkup;
    document.body.appendChild(measureRoot);

    const measuredHeightPx = measureRoot.getBoundingClientRect().height;
    document.body.removeChild(measureRoot);

    const MM_PER_PX = 25.4 / 96;
    const measuredHeightMm = measuredHeightPx * MM_PER_PX;
    const dynamicPageHeightMm = Math.max(120, Math.ceil(measuredHeightMm + 3));

    const printWindow = window.open(
      "",
      "_blank",
      "noopener,noreferrer,width=420,height=900",
    );

    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Print Receipt</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');

            :root { color-scheme: light; }
            * { box-sizing: border-box; }
            html, body {
              margin: 0;
              padding: 0;
              background: #fff;
              color: #000;
              width: ${THERMAL_PAPER_WIDTH_MM}mm;
              max-width: ${THERMAL_PAPER_WIDTH_MM}mm;
              min-height: fit-content;
              height: auto;
              font-family: "Noto Sans Sinhala", sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            /* One continuous strip: no internal pagination for the receipt block */
            .thermal-print-root {
              display: block;
              width: ${THERMAL_PAPER_WIDTH_MM}mm;
              max-width: ${THERMAL_PAPER_WIDTH_MM}mm;
              margin: 0;
              padding: 0;
              break-inside: auto;
              page-break-inside: auto;
              -webkit-region-break-inside: auto;
            }
            .receipt-shell {
              width: ${THERMAL_CONTENT_WIDTH_MM}mm;
              max-width: ${THERMAL_CONTENT_WIDTH_MM}mm;
              background: #fff;
              color: #000;
              line-height: 1.2;
              margin: 0 auto;
              break-inside: auto;
              page-break-inside: auto;
            }
            #print-root { display: none; }
            .receipt-content {
              width: 100%;
              padding: 3mm 3mm 2mm;
            }
            .thermal-dash {
              border-bottom: 1.5px dashed black !important;
            }
            @page {
              size: ${THERMAL_PAPER_WIDTH_MM}mm ${dynamicPageHeightMm}mm;
              margin: 0;
            }
            @media print {
              .screen-only, .no-print { display: none !important; }
              html, body {
                width: ${THERMAL_PAPER_WIDTH_MM}mm !important;
                max-width: ${THERMAL_PAPER_WIDTH_MM}mm !important;
                height: auto !important;
                min-height: auto !important;
                overflow: visible !important;
              }
              #print-root {
                display: block !important;
                position: static !important;
                width: ${THERMAL_PAPER_WIDTH_MM}mm !important;
                box-sizing: border-box !important;
                padding: 3mm 3mm 2mm !important;
                margin: 0 !important;
                background: #fff !important;
                color: #000 !important;
                font-family: "Noto Sans Sinhala", sans-serif !important;
                font-size: 12px !important;
                line-height: 1.35 !important;
              }
              #print-root {
                color: #000 !important;
              }
              #print-root * {
                max-width: 100% !important;
              }
              #print-root .total-highlight,
              #print-root .total-highlight * {
                background: #000 !important;
                color: #fff !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              #print-root .receipt-section,
              #print-root .receipt-row {
                page-break-inside: auto !important;
                break-inside: auto !important;
              }
              #print-root .receipt-item {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
          </style>
        </head>
        <body>
          <div id="print-root" class="thermal-print-root">${printMarkup}</div>
        </body>
      </html>
    `);
    printWindow.document.close();

    const triggerPrint = () => {
      printWindow.focus();
      printWindow.print();
    };

    const schedulePrint = () => {
      window.setTimeout(triggerPrint, 120);
    };

    if (printWindow.document.fonts?.ready) {
      void printWindow.document.fonts.ready.then(schedulePrint);
    } else {
      schedulePrint();
    }
  };

  const handlePrint = () => {
    setShowPrintHint(true);
    handleBrowserPrint();
  };

  const renderReceiptByType = () => {
    if (printType === "type2") {
      return (
        <BillContentAlt
          receiptNo={receiptNo}
          billDate={initialBillDate}
          billTime={initialBillTime}
          items={items}
          shopDetails={shopDetails}
          subTotal={subTotal}
          tax={taxAmount}
          total={total}
          cashReceived={cashReceivedValue}
        />
      );
    }

    return (
      <BillContent
        receiptNo={receiptNo}
        billDate={initialBillDate}
        billTime={initialBillTime}
        items={items}
        shopDetails={shopDetails}
        subTotal={subTotal}
        tax={taxAmount}
        total={total}
        cashReceived={cashReceivedValue}
      />
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');

        #print-root { display: none; }
        .print-only { display: none; }
        .thermal-dash { border-bottom: 1.5px dashed black !important; }
        .receipt-shell {
          width: ${THERMAL_CONTENT_WIDTH_MM}mm;
          background-color: white;
          color: black;
          line-height: 1.2;
          margin: 0 auto;
        }
        .receipt-content {
          box-sizing: border-box;
          width: 100%;
          padding: 3mm 3mm 2mm;
        }

        @media print {
          .screen-only, .no-print { display: none !important; }

          .print-only {
            display: block !important;
            position: static !important;
            width: ${THERMAL_PAPER_WIDTH_MM}mm;
            box-sizing: border-box;
            margin: 0 auto;
            break-inside: auto;
            page-break-inside: auto;
          }
          #print-root {
            display: block !important;
            position: static !important;
            width: ${THERMAL_PAPER_WIDTH_MM}mm !important;
            box-sizing: border-box !important;
            padding: 3mm 3mm 2mm !important;
            margin: 0 !important;
            background: #fff !important;
            color: #000 !important;
            font-family: "Noto Sans Sinhala", sans-serif !important;
            font-size: 12px !important;
            line-height: 1.35 !important;
          }
          #print-root {
            color: #000 !important;
          }
          #print-root * {
            max-width: 100% !important;
          }
          #print-root .total-highlight,
          #print-root .total-highlight * {
            background: #000 !important;
            color: #fff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          #print-root .receipt-section,
          #print-root .receipt-row {
            page-break-inside: auto !important;
            break-inside: auto !important;
          }
          #print-root .receipt-item {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          @page {
            size: ${THERMAL_PAPER_WIDTH_MM}mm auto;
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
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="mb-3 text-lg font-semibold">Payment</h2>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cashReceived}
              onChange={(event) => setCashReceived(event.target.value)}
              placeholder={`Cash Received (default ${total.toFixed(2)})`}
              className="w-full rounded border p-2"
            />
          </div>
          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="mb-3 text-lg font-semibold">Print Type</h2>
            <select
              value={printType}
              onChange={(event) => setPrintType(event.target.value as PrintType)}
              className="w-full rounded border bg-white p-2"
            >
              <option value="type1">Print Type 1</option>
              <option value="type2">Print Type 2</option>
            </select>
          </div>

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
          tax={taxAmount}
          total={total}
          cashReceived={cashReceivedValue}
        />
      </div>

      <div
        id="print-root"
        ref={printTemplateRef}
        className="print-only"
        style={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}
      >
        <div className="receipt-shell">
          {renderReceiptByType()}
        </div>
      </div>
    </>
  );
};
