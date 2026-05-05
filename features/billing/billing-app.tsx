"use client";

import { useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { ChevronDown, Printer, Settings } from "lucide-react";

import { AddItemForm } from "@/components/billing/add-item-form";
import { billingInputClass, billingLabelClass, SettingsSection } from "@/components/billing/settings-section";
import { BillContent } from "@/components/billing/bill-content";
import { BillContentAlt } from "@/components/billing/bill-content-alt";
import { BillContentType3 } from "@/components/billing/bill-content-type3";
import { BillContentType4 } from "@/components/billing/bill-content-type4";
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
type PrintType = "type1" | "type2" | "type3" | "type4";

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
                font-size: 17px !important;
                line-height: 1.15 !important;
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

    if (printType === "type3") {
      return (
        <BillContentType3
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

    if (printType === "type4") {
      return (
        <BillContentType4
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
            font-size: 17px !important;
            line-height: 1.15 !important;
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
        className="no-print flex min-h-screen flex-col bg-zinc-100 text-zinc-900 antialiased lg:flex-row"
        style={{ fontFamily: '"Noto Sans Sinhala", ui-sans-serif, system-ui, sans-serif' }}
      >
        <aside className="flex w-full min-w-0 shrink-0 flex-col border-zinc-200 bg-zinc-50 lg:flex-[0_0_min(620px,100%)] xl:flex-[0_0_min(680px,52%)] lg:border-r">
          <header className="sticky top-0 z-20 border-b border-zinc-200/90 bg-zinc-50/95 px-3 py-3 backdrop-blur-md sm:px-4">
            <div className="flex items-center gap-2.5">
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-[5px] border border-zinc-300 bg-zinc-100"
                aria-hidden
              >
                <Settings className="size-[15px] text-zinc-600" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-semibold tracking-tight text-zinc-900 sm:text-[15px]">Bill settings</h1>
                <p className="truncate text-[10px] leading-tight text-zinc-500 sm:text-[11px]">
                  Store, lines, payment — preview syncs on the right.
                </p>
              </div>
            </div>
          </header>

          <div className="flex flex-1 flex-col overflow-y-auto px-3 py-3 sm:px-4">
            <div className="flex w-full flex-col gap-3">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2 xl:items-start xl:gap-3">
                <ShopDetailsForm values={shopDetails} onChange={handleShopDetailsChange} />
                <AddItemForm value={newItem} onChange={setNewItem} onSubmit={handleAddItem} />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SettingsSection title="Payment" description={`Due Rs ${total.toFixed(2)} (incl. tax)`}>
                  <div>
                    <label htmlFor="cash-received" className={billingLabelClass}>
                      Cash received
                    </label>
                    <input
                      id="cash-received"
                      type="number"
                      min="0"
                      step="0.01"
                      value={cashReceived}
                      onChange={(event) => setCashReceived(event.target.value)}
                      placeholder={`Default ${total.toFixed(2)}`}
                      className={billingInputClass}
                    />
                  </div>
                </SettingsSection>

                <SettingsSection title="Print" description="Receipt layout for thermal print">
                  <div>
                    <label htmlFor="print-template" className={billingLabelClass}>
                      Layout
                    </label>
                    <div className="relative">
                      <select
                        id="print-template"
                        value={printType}
                        onChange={(event) => setPrintType(event.target.value as PrintType)}
                        className={`${billingInputClass} w-full cursor-pointer appearance-none pr-9 font-medium text-zinc-900 transition hover:border-zinc-400`}
                      >
                        <option value="type1">T1 · Classic bar</option>
                        <option value="type2">T2 · Lined total</option>
                        <option value="type3">T3 · Ribbon row</option>
                        <option value="type4">T4 · Arrow value</option>
                      </select>
                      <ChevronDown
                        className="pointer-events-none absolute right-2.5 top-1/2 size-[17px] -translate-y-1/2 text-zinc-500"
                        aria-hidden
                        strokeWidth={2}
                      />
                    </div>
                  </div>
                </SettingsSection>
              </div>

              <div>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex h-9 w-full items-center justify-center gap-2 rounded-[5px] bg-zinc-900 text-xs font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:ring-offset-1 sm:text-sm"
                >
                  <Printer className="size-4" strokeWidth={2} aria-hidden />
                  Print bill
                </button>
                {showPrintHint ? <PrintHint /> : null}
              </div>
            </div>
          </div>
        </aside>

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
