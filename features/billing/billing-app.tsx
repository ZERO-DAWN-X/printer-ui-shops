"use client";

import { useId, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { Printer, Settings } from "lucide-react";

import { AddItemForm } from "@/components/billing/add-item-form";
import { ReceiptPreview } from "@/components/billing/receipt-preview";
import { ShopDetailsForm } from "@/components/billing/shop-details-form";
import { DEFAULT_ITEMS, DEFAULT_SHOP_DETAILS } from "@/data/mock-billing";
import { useDirectThermalPrint } from "@/hooks/use-direct-thermal-print";
import { useUsbThermalPrint } from "@/hooks/use-usb-thermal-print";
import type { CartItem, NewItemForm, ShopDetails } from "@/types/billing";
import type { ReceiptPayload, ThermalConnectionMode } from "@/types/thermal";
import { calculateSubtotal, generateReceiptFromSeed } from "@/utils/billing";

const INITIAL_NEW_ITEM: NewItemForm = { name: "", qty: 1, price: "" };

type BillingAppProps = {
  initialBillDate: string;
  initialBillTime: string;
};

export const BillingApp = ({ initialBillDate, initialBillTime }: BillingAppProps) => {
  const [shopDetails, setShopDetails] = useState<ShopDetails>(DEFAULT_SHOP_DETAILS);
  const [items, setItems] = useState<CartItem[]>(DEFAULT_ITEMS);
  const [newItem, setNewItem] = useState<NewItemForm>(INITIAL_NEW_ITEM);
  const [connectionMode, setConnectionMode] = useState<ThermalConnectionMode>("usb");
  const [printerHost, setPrinterHost] = useState("");
  const [printerPort, setPrinterPort] = useState("9100");
  const receiptSeed = useId();
  const receiptNo = useMemo(() => generateReceiptFromSeed(receiptSeed), [receiptSeed]);

  const usbPrint = useUsbThermalPrint();
  const networkPrint = useDirectThermalPrint();

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

  const handleShopDetailsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setShopDetails((prev) => ({ ...prev, [name]: value }));
  };

  const receiptPayload = useMemo<ReceiptPayload>(
    () => ({
      receiptNo,
      billDate: initialBillDate,
      billTime: initialBillTime,
      items,
      shopDetails,
      subTotal,
      tax,
      total,
    }),
    [initialBillDate, initialBillTime, items, receiptNo, shopDetails, subTotal, tax, total],
  );

  const handlePrint = async () => {
    if (connectionMode === "network") {
      const port = Number(printerPort) || 9100;
      await networkPrint.print(printerHost, port, receiptPayload);
      return;
    }

    let printerToUse = usbPrint.selectedPrinter;
    if (!usbPrint.isConnected) {
      try {
        printerToUse = await usbPrint.connect();
      } catch {
        return;
      }
    }
    await usbPrint.print(receiptPayload, printerToUse);
  };

  const isPrinting = connectionMode === "network" ? networkPrint.isPrinting : usbPrint.isPrinting;
  const statusMessage = connectionMode === "network" ? networkPrint.message : usbPrint.message;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Sinhala:wght@400;700;900&display=swap');

        .thermal-dash { border-bottom: 1.5px dashed black !important; }
        .receipt-shell {
          width: 72mm;
          background-color: white;
          color: black;
          line-height: 1.2;
          margin: 0 auto;
        }
        .receipt-content {
          box-sizing: border-box;
          width: 100%;
          padding: 5mm 4mm 6mm;
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
        className="min-h-screen flex flex-col bg-[#e8eaed] text-gray-800 md:flex-row"
        style={{ fontFamily: '"Noto Sans Sinhala", sans-serif' }}
      >
        <div className="z-20 w-full overflow-y-auto border-r border-gray-300 bg-white p-6 shadow-lg md:w-1/2">
          <h1 className="mb-6 flex items-center text-2xl font-bold text-blue-600">
            <Settings className="mr-2" /> Bill Settings
          </h1>

          <ShopDetailsForm values={shopDetails} onChange={handleShopDetailsChange} />
          <AddItemForm value={newItem} onChange={setNewItem} onSubmit={handleAddItem} />

          <div className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <h2 className="mb-3 text-lg font-semibold">Printer Connection Mode</h2>
            <div className="grid gap-3">
              <select
                value={connectionMode}
                onChange={(event) => setConnectionMode(event.target.value as ThermalConnectionMode)}
                className="w-full rounded border bg-white p-2"
              >
                <option value="usb">USB (QZ Tray)</option>
                <option value="network">Network IP (LAN/WiFi)</option>
              </select>

              {connectionMode === "usb" ? (
                <>
                  <button
                    type="button"
                    onClick={() => void usbPrint.connect()}
                    disabled={usbPrint.isConnecting}
                    className="rounded border border-gray-300 bg-white p-2 font-medium hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {usbPrint.isConnecting ? "Connecting..." : "Connect USB Printer"}
                  </button>
                  <select
                    value={usbPrint.selectedPrinter}
                    onChange={(event) => usbPrint.setSelectedPrinter(event.target.value)}
                    className="w-full rounded border bg-white p-2"
                    disabled={!usbPrint.printers.length}
                  >
                    {usbPrint.printers.length === 0 ? (
                      <option value="">No printers found</option>
                    ) : null}
                    {usbPrint.printers.map((printerName) => (
                      <option key={printerName} value={printerName}>
                        {printerName}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <>
                  <input
                    value={printerHost}
                    onChange={(event) => setPrinterHost(event.target.value)}
                    placeholder="Printer IP (example: 192.168.1.50)"
                    className="w-full rounded border p-2"
                  />
                  <input
                    value={printerPort}
                    onChange={(event) => setPrinterPort(event.target.value)}
                    placeholder="Port (default 9100)"
                    className="w-full rounded border p-2"
                  />
                </>
              )}

              <p className="text-xs text-gray-600">
                USB mode is best for USB connection. Network mode uses IP and port 9100.
              </p>

              {statusMessage ? (
                <p
                  className={`rounded border p-2 text-xs ${
                    statusMessage.toLowerCase().includes("failed") ||
                    statusMessage.toLowerCase().includes("required") ||
                    statusMessage.toLowerCase().includes("timed") ||
                    statusMessage.toLowerCase().includes("no printers")
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-green-200 bg-green-50 text-green-700"
                  }`}
                >
                  {statusMessage}
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handlePrint()}
            disabled={isPrinting}
            className="flex w-full justify-center rounded-xl bg-black p-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Printer className="mr-2" /> {isPrinting ? "Printing..." : "Print Thermal Bill"}
          </button>
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
        />
      </div>
    </>
  );
};
