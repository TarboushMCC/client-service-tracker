import type { BillingType, ServiceStatus } from "./types";

export function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

export const billingLabels: Record<BillingType, string> = {
  monthly: "Monthly",
  yearly: "Yearly",
  lifetime: "Lifetime",
  one_time: "One-time",
};

export const statusLabels: Record<ServiceStatus, string> = {
  active: "Active",
  paused: "Paused",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function daysUntil(value: string | null): number | null {
  if (!value) return null;
  const d = new Date(value + "T00:00:00");
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

/** Approximate monthly value for a service, used for recurring-revenue totals. */
export function monthlyValue(amount: number, billingType: BillingType): number {
  switch (billingType) {
    case "monthly":
      return amount;
    case "yearly":
      return amount / 12;
    default:
      return 0;
  }
}
