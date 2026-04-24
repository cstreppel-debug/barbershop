import { cn } from "@/lib/utils";
import type { AppointmentStatus } from "@/lib/types";

const config: Record<
  AppointmentStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "In afwachting",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  confirmed: {
    label: "Bevestigd",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Geannuleerd",
    className: "bg-red-50 text-red-600 border-red-200",
  },
  completed: {
    label: "Afgerond",
    className: "bg-neutral-100 text-neutral-500 border-neutral-200",
  },
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const { label, className } = config[status] ?? config.pending;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {label}
    </span>
  );
}
