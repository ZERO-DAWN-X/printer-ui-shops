"use client";

import Image from "next/image";
import { useId, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Printer, Settings } from "lucide-react";

import { AddItemForm } from "@/components/billing/add-item-form";
import { billingInputClass, billingLabelClass, SettingsSection } from "@/components/billing/settings-section";
import { BillContent } from "@/components/billing/bill-content";
import { BillContentAlt } from "@/components/billing/bill-content-alt";
import { BillContentType3 } from "@/components/billing/bill-content-type3";
import { BillContentType4 } from "@/components/billing/bill-content-type4";
import { BillContentBakery } from "@/components/billing/bill-content-bakery";
import { BillContentPc } from "@/components/billing/bill-content-pc";
import { BillContentRestaurant } from "@/components/billing/bill-content-restaurant";
import { PrintHint } from "@/components/billing/print-hint";
import { PrintLayoutSelect, type PrintLayoutValue } from "@/components/billing/print-layout-select";
import { ReceiptPreview } from "@/components/billing/receipt-preview";
import { ShopDetailsForm } from "@/components/billing/shop-details-form";
import { ShopLayoutNotesForm } from "@/components/billing/shop-layout-notes-form";
import {
  DEFAULT_ITEMS,
  DEFAULT_SHOP_DETAILS,
  FOREIGN_SHOP_DETAILS,
  FOREIGN_SHOP_ITEMS,
} from "@/data/mock-billing";
import type { BillingCurrency, CartItem, NewItemForm, ShopDetails } from "@/types/billing";
import {
  BILLING_TAX_RATE,
  calculateSubtotal,
  formatMoneyTotal,
  generateReceiptFromSeed,
} from "@/utils/billing";

const INITIAL_NEW_ITEM: NewItemForm = { name: "", qty: 1, price: "" };
const THERMAL_PAPER_WIDTH_MM = 80;
const THERMAL_CONTENT_WIDTH_MM = 72;
type PrintType = PrintLayoutValue;

type BillingAppProps = {
  initialBillDate: string;
  initialBillTime: string;
};

export const BillingApp = ({
  initialBillDate,
  initialBillTime,
}: BillingAppProps) => {
  const [shopDetails, setShopDetails] = useState<ShopDetails>(() => ({ ...FOREIGN_SHOP_DETAILS }));
  const [items, setItems] = useState<CartItem[]>(() =>
    FOREIGN_SHOP_ITEMS.map((row) => ({ ...row })),
  );
  const [newItem, setNewItem] = useState<NewItemForm>(INITIAL_NEW_ITEM);
  const [cashReceived, setCashReceived] = useState<string>("50");
  const [printType, setPrintType] = useState<PrintType>("type1");
  const [language, setLanguage] = useState<"en" | "si">("en");
  const [showPrintHint, setShowPrintHint] = useState(false);
  const printTemplateRef = useRef<HTMLDivElement>(null);
  const layoutSelectLabelId = useId();
  const receiptSeed = useId();
  const receiptNo = useMemo(() => generateReceiptFromSeed(receiptSeed), [receiptSeed]);

  const billingCurrency: BillingCurrency = language === "en" ? "usd" : "lkr";

  const syncLocalePreset = (next: "en" | "si") => {
    if (next === "en") {
      setShopDetails({ ...FOREIGN_SHOP_DETAILS });
      setItems(FOREIGN_SHOP_ITEMS.map((row) => ({ ...row })));
      setCashReceived("50");
    } else {
      setShopDetails({ ...DEFAULT_SHOP_DETAILS });
      setItems(DEFAULT_ITEMS.map((row) => ({ ...row })));
      setCashReceived("4000");
    }
    setNewItem(INITIAL_NEW_ITEM);
  };

  const handleLanguageChange = (next: "en" | "si") => {
    if (language !== next) {
      syncLocalePreset(next);
    }
    setLanguage(next);
  };

  const subTotal = useMemo(() => calculateSubtotal(items), [items]);
  const taxAmount = useMemo(() => subTotal * BILLING_TAX_RATE, [subTotal]);
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

  const handleShopDetailsChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
          currency={billingCurrency}
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
          currency={billingCurrency}
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
          currency={billingCurrency}
        />
      );
    }

    if (printType === "type5") {
      return (
        <BillContentBakery
          receiptNo={receiptNo}
          billDate={initialBillDate}
          billTime={initialBillTime}
          items={items}
          shopDetails={shopDetails}
          subTotal={subTotal}
          tax={taxAmount}
          total={total}
          cashReceived={cashReceivedValue}
          currency={billingCurrency}
        />
      );
    }

    if (printType === "type6") {
      return (
        <BillContentPc
          receiptNo={receiptNo}
          billDate={initialBillDate}
          billTime={initialBillTime}
          items={items}
          shopDetails={shopDetails}
          subTotal={subTotal}
          tax={taxAmount}
          total={total}
          cashReceived={cashReceivedValue}
          currency={billingCurrency}
        />
      );
    }

    if (printType === "type7") {
      return (
        <BillContentRestaurant
          receiptNo={receiptNo}
          billDate={initialBillDate}
          billTime={initialBillTime}
          items={items}
          shopDetails={shopDetails}
          subTotal={subTotal}
          tax={taxAmount}
          total={total}
          cashReceived={cashReceivedValue}
          currency={billingCurrency}
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
        currency={billingCurrency}
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
        className="no-print relative flex min-h-dvh min-h-[100svh] w-full max-w-[100vw] flex-col bg-zinc-100 text-zinc-900 antialiased lg:flex-row"
        style={{ fontFamily: '"Noto Sans Sinhala", ui-sans-serif, system-ui, sans-serif' }}
      >
        <aside className="flex w-full min-w-0 shrink-0 flex-col border-b border-zinc-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:h-dvh lg:w-[min(620px,100vw)] lg:overflow-hidden lg:border-r lg:border-b-0 xl:w-[min(680px,52vw)]">
          <header className="shrink-0 bg-white px-[max(0.625rem,env(safe-area-inset-left))] py-2 pr-[max(0.625rem,env(safe-area-inset-right))] pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-4 sm:py-2.5 sm:pr-4 sm:pt-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
              <div className="flex min-w-0 items-center gap-2.5">
                <div
                  className="flex size-8 shrink-0 items-center justify-center rounded-[5px] border border-zinc-300 bg-zinc-100"
                  aria-hidden
                >
                  <Settings className="size-[15px] text-zinc-600" strokeWidth={1.75} />
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm font-semibold tracking-tight text-zinc-900 sm:text-[15px]">
                    ZERO ZEEKERS
                  </h1>
                  <p className="truncate text-[10px] leading-tight text-zinc-500 sm:text-[11px]">
                    Bill · store · preview
                  </p>
                </div>
              </div>
              <div
                className="flex shrink-0 rounded-[6px] border border-zinc-200 bg-zinc-50 p-0.5"
                role="group"
                aria-label="Language"
              >
                <button
                  type="button"
                  aria-pressed={language === "en"}
                  onClick={() => handleLanguageChange("en")}
                  className={`min-h-10 touch-manipulation rounded-[5px] px-3 py-1.5 text-[11px] font-medium transition sm:min-h-0 sm:px-3 sm:py-1 sm:text-xs ${
                    language === "en"
                      ? "bg-black text-white"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  aria-pressed={language === "si"}
                  onClick={() => handleLanguageChange("si")}
                  className={`min-h-10 touch-manipulation rounded-[5px] px-3 py-1.5 text-[11px] font-medium transition sm:min-h-0 sm:px-3 sm:py-1 sm:text-xs ${
                    language === "si"
                      ? "bg-black text-white"
                      : "text-zinc-600 hover:text-zinc-900"
                  }`}
                >
                  Sinhala
                </button>
              </div>
            </div>
          </header>

          <div className="flex min-h-0 flex-1 flex-col lg:overflow-hidden">
            <div className="flex flex-1 flex-col gap-2 overflow-x-hidden px-[max(0.625rem,env(safe-area-inset-left))] py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pr-[max(0.625rem,env(safe-area-inset-right))] sm:gap-2.5 sm:px-4 sm:py-2.5 sm:pr-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:overscroll-y-contain [scrollbar-gutter:stable]">
              <div className="grid min-w-0 grid-cols-1 gap-2 lg:grid-cols-2 lg:items-start lg:gap-x-3 lg:gap-y-2">
                  <ShopDetailsForm values={shopDetails} onChange={handleShopDetailsChange} />
                  <div className="flex min-w-0 flex-col gap-2 sm:gap-2.5">
                    <AddItemForm
                      value={newItem}
                      onChange={setNewItem}
                      onSubmit={handleAddItem}
                      priceUnitShort={billingCurrency === "usd" ? "$" : "Rs"}
                    />
                    <ShopLayoutNotesForm values={shopDetails} onChange={handleShopDetailsChange} />
                  </div>
                </div>

                <div className="grid min-w-0 grid-cols-1 gap-2 min-[560px]:grid-cols-2 min-[560px]:gap-x-3 min-[560px]:gap-y-2">
                  <SettingsSection
                    title="Payment"
                    description={`Due ${formatMoneyTotal(total, billingCurrency)} (incl. tax)`}
                  >
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
                      <p id={layoutSelectLabelId} className={billingLabelClass}>
                        Layout
                      </p>
                      <PrintLayoutSelect labelId={layoutSelectLabelId} value={printType} onChange={setPrintType} />
                    </div>
                  </SettingsSection>
                </div>

                <div className="sticky bottom-0 z-10 -mx-[max(0.625rem,env(safe-area-inset-left))] bg-white/95 px-[max(0.625rem,env(safe-area-inset-left))] pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur-sm sm:relative sm:z-0 sm:mx-0 sm:bg-transparent sm:px-0 sm:pb-0 sm:pt-0 sm:backdrop-blur-none lg:static lg:bg-transparent lg:backdrop-blur-none">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="flex min-h-11 w-full touch-manipulation items-center justify-center gap-2 rounded-[5px] bg-zinc-900 px-3 text-[12px] font-semibold text-white transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 sm:min-h-9 sm:h-9 sm:text-xs lg:ring-offset-1"
                  >
                    <Printer className="size-4 shrink-0 sm:size-4" strokeWidth={2} aria-hidden />
                    Print bill
                  </button>
                  {showPrintHint ? <PrintHint /> : null}
                </div>

              <div className="mt-auto flex w-full shrink-0 flex-col items-center border-t border-zinc-100 px-1 pb-3 pt-2 sm:mt-2 sm:border-0 sm:px-2 sm:pb-4 sm:pt-2 lg:border-t lg:border-transparent">
                <Image
                  src="/logo.jpeg"
                  alt="ZERO ZEEKERS"
                  width={480}
                  height={240}
                  sizes="(max-width: 580px) 90vw, (max-width: 1024px) 52vw, 240px"
                  className="h-auto w-full max-w-[min(240px,calc(100vw-2rem))] object-contain"
                  draggable={false}
                  priority={false}
                />
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 w-full flex-1 lg:min-h-dvh lg:w-auto lg:flex-1 lg:pl-[min(620px,100vw)] xl:pl-[min(680px,52vw)]">
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
            currency={billingCurrency}
            previewLocale={language}
          />
        </div>
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
