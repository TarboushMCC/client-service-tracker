import clsx from "clsx";
import type { BillingType, ServiceStatus } from "@/lib/types";
import { billingLabels, statusLabels } from "@/lib/format";

export function StatusBadge({ status }: { status: ServiceStatus }) {
  const styles: Record<ServiceStatus, string> = {
    active: "bg-success-soft text-success",
    paused: "bg-warning-soft text-warning",
    completed: "bg-surface-muted text-muted",
    cancelled: "bg-danger-soft text-danger",
  };
  return (
    <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", styles[status])}>
      {statusLabels[status]}
    </span>
  );
}

export function BillingBadge({ type }: { type: BillingType }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-accent-soft text-accent">
      {billingLabels[type]}
    </span>
  );
}

export function DueBadge({ days }: { days: number | null }) {
  if (days === null) return <span className="text-xs text-muted">No date</span>;
  if (days < 0)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-danger-soft text-danger">
        Overdue {Math.abs(days)}d
      </span>
    );
  if (days <= 14)
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-warning-soft text-warning">
        Due in {days}d
      </span>
    );
  return <span className="text-xs text-muted">Due in {days}d</span>;
}
