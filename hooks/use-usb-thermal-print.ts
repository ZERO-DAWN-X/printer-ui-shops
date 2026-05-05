"use client";

import { useCallback, useState } from "react";

import type { ReceiptPayload } from "@/types/thermal";
import { buildEscPosReceipt } from "@/utils/escpos";

type UsbPrintState = {
  isConnecting: boolean;
  isPrinting: boolean;
  isConnected: boolean;
  printers: string[];
  selectedPrinter: string;
  message: string;
};

type QzRawData = {
  type: "raw";
  format: "command";
  flavor: "plain";
  data: string;
};

const initialState: UsbPrintState = {
  isConnecting: false,
  isPrinting: false,
  isConnected: false,
  printers: [],
  selectedPrinter: "",
  message: "",
};

const withTimeout = async <T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage: string,
): Promise<T> => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  try {
    return await Promise.race<T>([
      promise,
      new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
      }),
    ]);
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }
};

const normalizePrinters = (value: unknown): string[] => {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.filter((entry): entry is string => typeof entry === "string");
  }
  if (typeof value === "string") {
    return [value];
  }
  return [];
};

export const useUsbThermalPrint = () => {
  const [state, setState] = useState<UsbPrintState>(initialState);

  const connect = useCallback(async () => {
    setState((prev) => ({ ...prev, isConnecting: true, message: "" }));

    try {
      const { default: qz } = await import("qz-tray");
      if (!qz.websocket.isActive()) {
        await withTimeout(
          qz.websocket.connect({ retries: 2, delay: 1 }),
          7000,
          "QZ Tray connection timed out. Open QZ Tray desktop app and allow access.",
        );
      }

      const found = await withTimeout(
        qz.printers.find(),
        7000,
        "Connected to QZ Tray, but printer query timed out.",
      );
      const printers = normalizePrinters(found);
      if (!printers.length) {
        try {
          const fallbackDefault = await withTimeout(
            qz.printers.getDefault(),
            5000,
            "Default printer lookup timed out.",
          );
          if (fallbackDefault) {
            printers.push(fallbackDefault);
          }
        } catch {
          // Ignore default-printer lookup failures.
        }
      }

      let selected = "";
      setState((prev) => {
        selected = prev.selectedPrinter || printers[0] || "";
        return {
          ...prev,
          isConnecting: false,
          isConnected: true,
          printers,
          selectedPrinter: selected,
          message: printers.length
            ? "USB printer list loaded."
            : "QZ connected, but no printers found.",
        };
      });

      return selected;
    } catch (error) {
      const message = error instanceof Error ? error.message : "USB printer connection failed.";
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        isConnected: false,
        message: `${message} Check: QZ Tray running, browser prompt allowed, and USB printer installed in Windows.`,
      }));
      throw error;
    }
  }, []);

  const setSelectedPrinter = useCallback((printerName: string) => {
    setState((prev) => ({ ...prev, selectedPrinter: printerName }));
  }, []);

  const print = useCallback(
    async (payload: ReceiptPayload, printerName?: string) => {
      const targetPrinter = printerName || state.selectedPrinter;
      if (!targetPrinter) {
        setState((prev) => ({ ...prev, message: "Select a USB printer first." }));
        return false;
      }

      setState((prev) => ({ ...prev, isPrinting: true, message: "" }));

      try {
        const { default: qz } = await import("qz-tray");
        if (!qz.websocket.isActive()) {
          await qz.websocket.connect({ retries: 2, delay: 1 });
        }

        const config = qz.configs.create(targetPrinter, {
          encoding: "CP437",
        });
        const content = buildEscPosReceipt(payload);
        const rawPayload: QzRawData = {
          type: "raw",
          format: "command",
          flavor: "plain",
          data: content,
        };
        await withTimeout(qz.print(config, [rawPayload]), 10000, "USB print timed out before reaching printer.");

        setState((prev) => ({
          ...prev,
          isPrinting: false,
          isConnected: true,
          message: "USB thermal print sent.",
        }));
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "USB thermal print failed.";
        setState((prev) => ({ ...prev, isPrinting: false, message }));
        return false;
      }
    },
    [state.selectedPrinter],
  );

  const testPrint = useCallback(
    async (printerName?: string) => {
      const targetPrinter = printerName || state.selectedPrinter;
      if (!targetPrinter) {
        setState((prev) => ({ ...prev, message: "Select a USB printer first." }));
        return false;
      }

      setState((prev) => ({ ...prev, isPrinting: true, message: "" }));
      try {
        const { default: qz } = await import("qz-tray");
        if (!qz.websocket.isActive()) {
          await qz.websocket.connect({ retries: 2, delay: 1 });
        }
        const config = qz.configs.create(targetPrinter, { encoding: "CP437" });
        const testData: QzRawData = {
          type: "raw",
          format: "command",
          flavor: "plain",
          data: "\x1B@\x1Ba\x01TEST PRINT OK\n\x1Ba\x00\n\n\n\x1DV\x41\x03",
        };
        await withTimeout(qz.print(config, [testData]), 10000, "USB test print timed out.");
        setState((prev) => ({
          ...prev,
          isPrinting: false,
          isConnected: true,
          message: "USB test print sent.",
        }));
        return true;
      } catch (error) {
        const message = error instanceof Error ? error.message : "USB test print failed.";
        setState((prev) => ({ ...prev, isPrinting: false, message }));
        return false;
      }
    },
    [state.selectedPrinter],
  );

  return {
    ...state,
    connect,
    setSelectedPrinter,
    print,
    testPrint,
  };
};
