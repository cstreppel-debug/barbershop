"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { updateAppointmentStatus } from "@/actions/updateAppointmentStatus";
import type { AppointmentWithRelations, AppointmentStatus, Barber } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: { value: AppointmentStatus; label: string }[] = [
  { value: "pending",   label: "In afwachting" },
  { value: "confirmed", label: "Bevestigd" },
  { value: "cancelled", label: "Geannuleerd" },
  { value: "completed", label: "Afgerond" },
];

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(iso));
}

// ── StatusSelect ──────────────────────────────────────────────

function StatusSelect({
  appointmentId,
  currentStatus,
}: {
  appointmentId: string;
  currentStatus: AppointmentStatus;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<AppointmentStatus>(currentStatus);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(next: AppointmentStatus) {
    const prev = status;
    setStatus(next);   // optimistisch updaten
    setError(null);

    startTransition(async () => {
      const result = await updateAppointmentStatus(appointmentId, next);
      if (result.error) {
        setStatus(prev); // terugdraaien bij fout
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <div className="relative flex items-center gap-1.5">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as AppointmentStatus)}
        disabled={isPending}
        className={cn(
          "cursor-pointer rounded-lg border border-neutral-200 bg-white py-1.5 pl-2.5 pr-7 text-xs",
          "text-neutral-700 outline-none transition-colors",
          "hover:border-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10",
          isPending && "cursor-not-allowed opacity-50"
        )}
      >
        {STATUS_OPTIONS.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {isPending && (
        <Loader2 size={12} className="animate-spin text-neutral-400" />
      )}
      {error && (
        <span className="absolute -bottom-4 left-0 whitespace-nowrap text-xs text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}

// ── AppointmentTable ──────────────────────────────────────────

type Props = {
  appointments: AppointmentWithRelations[];
  barbers: Barber[];
};

export function AppointmentTable({ appointments, barbers }: Props) {
  const [barberId, setBarberId] = useState<string>("all");

  const visible =
    barberId === "all"
      ? appointments
      : appointments.filter((a) => a.barber_id === barberId);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <label className="text-sm text-neutral-500">Kapper:</label>
        <select
          value={barberId}
          onChange={(e) => setBarberId(e.target.value)}
          className="cursor-pointer rounded-lg border border-neutral-200 bg-white py-1.5 pl-3 pr-8 text-sm text-neutral-700 outline-none transition-colors hover:border-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
        >
          <option value="all">Alle kappers</option>
          {barbers.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel */}
      {visible.length === 0 ? (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 py-12 text-center">
          <p className="text-sm text-neutral-400">Geen afspraken gevonden.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  {["Datum", "Tijd", "Klant", "Behandeling", "Kapper", "Status", "Actie"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {visible.map((appt) => (
                  <tr
                    key={appt.id}
                    className="group transition-colors hover:bg-neutral-50"
                  >
                    <td className="whitespace-nowrap px-4 py-3.5 text-neutral-500">
                      {formatDate(appt.starts_at)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 font-medium text-neutral-900">
                      {formatTime(appt.starts_at)}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-neutral-900">
                        {appt.customer_name}
                      </p>
                      <p className="text-xs text-neutral-400">
                        {appt.customer_email}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-neutral-700">
                      {appt.service.name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3.5 text-neutral-700">
                      {appt.barber.name}
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={appt.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusSelect
                        appointmentId={appt.id}
                        currentStatus={appt.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
