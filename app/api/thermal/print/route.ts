import net from "node:net";
import { NextResponse } from "next/server";

import type { DirectThermalPrintRequest, ReceiptPayload } from "@/types/thermal";
import { buildEscPosReceipt } from "@/utils/escpos";

export const runtime = "nodejs";

const DEFAULT_PORT = 9100;

const isReceiptPayload = (value: unknown): value is ReceiptPayload => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const payload = value as Partial<ReceiptPayload>;
  return (
    typeof payload.receiptNo === "string" &&
    typeof payload.billDate === "string" &&
    typeof payload.billTime === "string" &&
    Array.isArray(payload.items) &&
    typeof payload.shopDetails === "object" &&
    typeof payload.subTotal === "number" &&
    typeof payload.tax === "number" &&
    typeof payload.total === "number"
  );
};

const writeToPrinter = async (host: string, port: number, content: string): Promise<void> => {
  const buffer = Buffer.from(content, "utf8");

  await new Promise<void>((resolve, reject) => {
    const socket = net.createConnection({ host, port }, () => {
      socket.write(buffer, (error) => {
        if (error) {
          reject(error);
          socket.destroy();
          return;
        }
        socket.end();
      });
    });

    socket.setTimeout(5000);

    socket.on("timeout", () => {
      reject(new Error("Printer connection timed out"));
      socket.destroy();
    });

    socket.on("error", (error) => {
      reject(error);
      socket.destroy();
    });

    socket.on("close", () => resolve());
  });
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as DirectThermalPrintRequest;
    const host = body.host?.trim() || process.env.THERMAL_PRINTER_HOST;
    const port = body.port || Number(process.env.THERMAL_PRINTER_PORT || DEFAULT_PORT);

    if (!host) {
      return NextResponse.json(
        {
          ok: false,
          error: "Printer IP is required. Send host or set THERMAL_PRINTER_HOST.",
        },
        { status: 400 },
      );
    }

    if (!isReceiptPayload(body.payload)) {
      return NextResponse.json({ ok: false, error: "Invalid receipt payload." }, { status: 400 });
    }

    const receipt = buildEscPosReceipt(body.payload);
    await writeToPrinter(host, port, receipt);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Direct thermal print failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
