import { BillingApp } from "@/features/billing/billing-app";

export default function Home() {
  const now = new Date();
  const initialBillDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Colombo",
  }).format(now);
  const initialBillTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Colombo",
  }).format(now);

  return (
    <BillingApp
      initialBillDate={initialBillDate}
      initialBillTime={initialBillTime}
    />
  );
}
