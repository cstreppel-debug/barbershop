"use client";

import { useActionState } from "react";
import { AlertCircle } from "lucide-react";
import {
  createAppointment,
  type CreateAppointmentState,
} from "@/actions/createAppointment";
import { cn } from "@/lib/utils";

// ── Primitives ────────────────────────────────────────────────

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium text-neutral-700">
      {children}
    </label>
  );
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1.5 text-xs text-red-500">{messages[0]}</p>;
}

const inputClass = (hasError?: boolean) =>
  cn(
    "w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-neutral-900",
    "placeholder:text-neutral-400 outline-none transition-colors",
    "focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
      : "border-neutral-200"
  );

// ── BookingForm ───────────────────────────────────────────────

type Props = {
  serviceId: string;
  barberId: string;
  date: string;  // "YYYY-MM-DD"
  time: string;  // "HH:MM"
};

const initialState: CreateAppointmentState = {};

export function BookingForm({ serviceId, barberId, date, time }: Props) {
  const [state, formAction, isPending] = useActionState(
    createAppointment,
    initialState
  );

  const fe = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-5">
      {/* Verborgen velden met boekingcontext */}
      <input type="hidden" name="service_id" value={serviceId} />
      <input type="hidden" name="barber_id" value={barberId} />
      <input type="hidden" name="date" value={date} />
      <input type="hidden" name="time" value={time} />

      {/* Naam */}
      <div>
        <Label htmlFor="customer_name">Naam</Label>
        <input
          id="customer_name"
          name="customer_name"
          type="text"
          autoComplete="name"
          placeholder="Jan de Vries"
          required
          className={inputClass(!!fe.customer_name)}
        />
        <FieldError messages={fe.customer_name} />
      </div>

      {/* E-mail */}
      <div>
        <Label htmlFor="customer_email">E-mailadres</Label>
        <input
          id="customer_email"
          name="customer_email"
          type="email"
          autoComplete="email"
          placeholder="jan@example.nl"
          required
          className={inputClass(!!fe.customer_email)}
        />
        <FieldError messages={fe.customer_email} />
      </div>

      {/* Telefoon */}
      <div>
        <Label htmlFor="customer_phone">
          Telefoonnummer{" "}
          <span className="font-normal text-neutral-400">(optioneel)</span>
        </Label>
        <input
          id="customer_phone"
          name="customer_phone"
          type="tel"
          autoComplete="tel"
          placeholder="+31 6 12345678"
          className={inputClass(!!fe.customer_phone)}
        />
        <FieldError messages={fe.customer_phone} />
      </div>

      {/* Notitie */}
      <div>
        <Label htmlFor="notes">
          Notitie{" "}
          <span className="font-normal text-neutral-400">(optioneel)</span>
        </Label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Bijv. allergie voor bepaalde producten..."
          className={cn(inputClass(!!fe.notes), "resize-none")}
        />
        <FieldError messages={fe.notes} />
      </div>

      {/* Server-side fout */}
      {state.serverError && (
        <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{state.serverError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className={cn(
          "w-full rounded-2xl py-3.5 text-sm font-semibold transition-colors",
          isPending
            ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
            : "bg-neutral-900 text-white hover:bg-neutral-700"
        )}
      >
        {isPending ? "Bezig met boeken…" : "Bevestig afspraak"}
      </button>
    </form>
  );
}
