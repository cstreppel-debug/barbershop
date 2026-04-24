"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { saveHours, DAY_NAMES, DAY_ORDER, type HoursActionState } from "@/actions/hours";
import { cn } from "@/lib/utils";
import type { OpeningHours } from "@/lib/types";

const INITIAL: HoursActionState = {};

// ── DayRow ─────────────────────────────────────────────────────

function DayRow({ hours }: { hours: OpeningHours }) {
  const dow = hours.day_of_week;
  const [closed, setClosed] = useState(hours.is_closed);

  return (
    <div
      className={cn(
        "grid grid-cols-[140px_1fr] items-center gap-x-6 gap-y-3 rounded-2xl border p-4 transition-colors",
        "sm:grid-cols-[140px_auto_1fr]",
        closed
          ? "border-neutral-200 bg-neutral-50"
          : "border-neutral-200 bg-white"
      )}
    >
      {/* Naam + toggle */}
      <div className="flex items-center justify-between sm:flex-col sm:items-start sm:justify-start sm:gap-1">
        <span
          className={cn(
            "text-sm font-semibold",
            closed ? "text-neutral-400" : "text-neutral-900"
          )}
        >
          {DAY_NAMES[dow]}
        </span>

        <label className="flex cursor-pointer items-center gap-2">
          {/* Verborgen checkbox voor is_closed waarde */}
          <input type="hidden" name={`is_closed_${dow}`} value={String(closed)} />
          <button
            type="button"
            role="switch"
            aria-checked={!closed}
            onClick={() => setClosed((c) => !c)}
            className={cn(
              "relative h-5 w-9 rounded-full transition-colors",
              closed ? "bg-neutral-200" : "bg-neutral-900"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                closed ? "translate-x-0.5" : "translate-x-[18px]"
              )}
            />
          </button>
          <span className="text-xs text-neutral-400">
            {closed ? "Gesloten" : "Open"}
          </span>
        </label>
      </div>

      {/* Tijden — verborgen als gesloten */}
      {closed ? (
        <div className="col-span-1 sm:col-span-2 flex items-center">
          <span className="text-sm italic text-neutral-300">Gesloten</span>
          {/* Verborgen inputs zodat de form altijd geldige waarden stuurt */}
          <input type="hidden" name={`open_${dow}`}  value={hours.open_time.slice(0, 5)} />
          <input type="hidden" name={`close_${dow}`} value={hours.close_time.slice(0, 5)} />
          <input type="hidden" name={`id_${dow}`}    value={hours.id} />
        </div>
      ) : (
        <div className="col-span-1 sm:col-span-2 flex flex-wrap items-center gap-3">
          <input type="hidden" name={`id_${dow}`} value={hours.id} />

          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-500">Open</label>
            <input
              type="time"
              name={`open_${dow}`}
              defaultValue={hours.open_time.slice(0, 5)}
              required
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          <span className="text-neutral-300">–</span>

          <div className="flex items-center gap-2">
            <label className="text-xs text-neutral-500">Sluit</label>
            <input
              type="time"
              name={`close_${dow}`}
              defaultValue={hours.close_time.slice(0, 5)}
              required
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-900 outline-none focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── HoursEditor ───────────────────────────────────────────────

export function HoursEditor({ hours }: { hours: OpeningHours[] }) {
  const [state, action, isPending] = useActionState(saveHours, INITIAL);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (state.success) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 3000);
      return () => clearTimeout(t);
    }
  }, [state.success]);

  // Indexeer op day_of_week voor makkelijke lookup
  const byDay = Object.fromEntries(hours.map((h) => [h.day_of_week, h]));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Openingstijden</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            Stel in wanneer de zaak open is
          </p>
        </div>
      </div>

      <form action={action} className="max-w-2xl space-y-3">
        {DAY_ORDER.map((dow) => {
          const h = byDay[dow];
          return h ? <DayRow key={dow} hours={h} /> : null;
        })}

        {/* Feedback */}
        {state.serverError && (
          <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <AlertCircle size={15} className="shrink-0 text-red-500" />
            <p className="text-sm text-red-700">{state.serverError}</p>
          </div>
        )}
        {state.fieldError && (
          <div className="flex items-center gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <AlertCircle size={15} className="shrink-0 text-amber-500" />
            <p className="text-sm text-amber-700">{state.fieldError}</p>
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <CheckCircle size={15} className="shrink-0 text-emerald-500" />
            <p className="text-sm text-emerald-700">Openingstijden opgeslagen.</p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors",
              isPending
                ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
                : "bg-neutral-900 text-white hover:bg-neutral-700"
            )}
          >
            {isPending && <Loader2 size={13} className="animate-spin" />}
            {isPending ? "Opslaan…" : "Opslaan"}
          </button>
        </div>
      </form>
    </div>
  );
}
