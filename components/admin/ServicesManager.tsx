"use client";

import { useState, useTransition, useEffect, useActionState } from "react";
import { Plus, Pencil, ToggleLeft, ToggleRight, AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "./StatusBadge";
import { upsertService, toggleServiceActive, type ServiceActionState } from "@/actions/services";
import { formatPrice, formatDuration, cn } from "@/lib/utils";
import type { Service } from "@/lib/types";

// ── Formulierveld-helpers ─────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-neutral-700">
        {label}
      </label>
      {children}
      {error?.[0] && (
        <p className="mt-1.5 text-xs text-red-500">{error[0]}</p>
      )}
    </div>
  );
}

const inputCls = (hasError?: boolean) =>
  cn(
    "w-full rounded-xl border bg-white px-4 py-2.5 text-sm outline-none transition-colors",
    "placeholder:text-neutral-400 focus:ring-2",
    hasError
      ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
      : "border-neutral-200 focus:border-neutral-900 focus:ring-neutral-900/10"
  );

// ── ServiceForm ───────────────────────────────────────────────

const INITIAL: ServiceActionState = {};

function ServiceForm({
  service,
  onSuccess,
}: {
  service: Service | null;
  onSuccess: () => void;
}) {
  const [state, action, isPending] = useActionState(upsertService, INITIAL);

  // Sluit modal zodra actie slaagt
  useEffect(() => {
    if (state.success) onSuccess();
  }, [state.success, onSuccess]);

  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      {service && <input type="hidden" name="id" value={service.id} />}

      <Field label="Naam" error={fe.name}>
        <input
          name="name"
          type="text"
          defaultValue={service?.name ?? ""}
          placeholder="Bijv. Knippen & Stylen"
          className={inputCls(!!fe.name)}
          required
        />
      </Field>

      <Field label="Beschrijving (optioneel)" error={fe.description}>
        <textarea
          name="description"
          rows={2}
          defaultValue={service?.description ?? ""}
          placeholder="Korte omschrijving van de behandeling"
          className={cn(inputCls(!!fe.description), "resize-none")}
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Duur (minuten)" error={fe.duration_min}>
          <input
            name="duration_min"
            type="number"
            min={5}
            step={5}
            defaultValue={service?.duration_min ?? 30}
            className={inputCls(!!fe.duration_min)}
            required
          />
        </Field>

        <Field label="Prijs (€)" error={fe.price}>
          <input
            name="price"
            type="number"
            min={0}
            step={0.5}
            defaultValue={service?.price ?? ""}
            placeholder="25.00"
            className={inputCls(!!fe.price)}
            required
          />
        </Field>
      </div>

      {state.serverError && (
        <div className="flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3">
          <AlertCircle size={15} className="shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{state.serverError}</p>
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors",
            isPending
              ? "cursor-not-allowed bg-neutral-200 text-neutral-400"
              : "bg-neutral-900 text-white hover:bg-neutral-700"
          )}
        >
          {isPending && <Loader2 size={13} className="animate-spin" />}
          {service ? "Opslaan" : "Toevoegen"}
        </button>
      </div>
    </form>
  );
}

// ── ServicesManager ───────────────────────────────────────────

export function ServicesManager({ services }: { services: Service[] }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [toggling, startToggle] = useTransition();

  function openNew() { setEditing(null); setOpen(true); }
  function openEdit(s: Service) { setEditing(s); setOpen(true); }

  async function handleToggle(s: Service) {
    startToggle(async () => {
      await toggleServiceActive(s.id, !s.is_active);
    });
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Behandelingen</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            {services.length} behandeling{services.length !== 1 ? "en" : ""}
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
        >
          <Plus size={15} />
          Toevoegen
        </button>
      </div>

      {/* Tabel */}
      {services.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-sm text-neutral-400">Nog geen behandelingen. Voeg er een toe.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {["Naam", "Duur", "Prijs", "Status", "Acties"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-400"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {services.map((s) => (
                <tr key={s.id} className="group hover:bg-neutral-50">
                  <td className="px-5 py-4">
                    <p className="font-medium text-neutral-900">{s.name}</p>
                    {s.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-neutral-400">
                        {s.description}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-neutral-600">
                    {formatDuration(s.duration_min)}
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-medium text-neutral-900">
                    {formatPrice(s.price)}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={s.is_active ? "confirmed" : "cancelled"} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                        title="Bewerken"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleToggle(s)}
                        disabled={toggling}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-40"
                        title={s.is_active ? "Deactiveren" : "Activeren"}
                      >
                        {s.is_active
                          ? <ToggleRight size={16} className="text-emerald-500" />
                          : <ToggleLeft size={16} />
                        }
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? "Behandeling bewerken" : "Behandeling toevoegen"}
      >
        <ServiceForm
          key={editing?.id ?? "new"}
          service={editing}
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
