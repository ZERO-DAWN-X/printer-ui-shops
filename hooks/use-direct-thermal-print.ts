"use client";

import { useCallback, useState } from "react";

import type { ReceiptPayload } from "@/types/thermal";

type DirectPrintState = {
  isPrinting: boolean;
  message: string;
};

export const useDirectThermalPrint = () => {
  const [state, setState] = useState<DirectPrintState>({
    isPrinting: false,
    message: "",
  });

  const print = useCallback(async (host: string, port: number, payload: ReceiptPayload) => {
    setState({ isPrinting: true, message: "" });

    try {
      const response = await fetch("/api/thermal/print", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: host.trim() || undefined,
          port,
          payload,
        }),
      });

      const result = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !result.ok) {
        const message = result.error || "Thermal print failed.";
        setState({ isPrinting: false, message });
        return false;
      }

      setState({ isPrinting: false, message: "Print sent to thermal printer." });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Thermal print failed.";
      setState({ isPrinting: false, message });
      return false;
    }
  }, []);

  return {
    ...state,
    print,
  };
};
