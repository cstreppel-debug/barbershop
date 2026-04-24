"use client";

import { useState, useTransition, useEffect, useActionState } from "react";
import { Plus, Pencil, ToggleLeft, ToggleRight, AlertCircle, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { StatusBadge } from "./StatusBadge";
import { upsertBarber, toggleBarberActive, type BarberActionState } from "@/actions/barbers";
import { cn } from "@/lib/utils";
import type { Barber, Service } from "@/lib/types";

// ── Helpers ───────────────────────────────────────────────────

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
      {error?.[0] && <p className="mt-1.5 text-xs text-red-500">{error[0]}</p>}
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

// ── BarberForm ────────────────────────────────────────────────

const INITIAL: BarberActionState = {};

function BarberForm({
  barber,
  linkedServiceIds,
  allServices,
  onSuccess,
}: {
  barber: Barber | null;
  linkedServiceIds: string[];
  allServices: Service[];
  onSuccess: () => void;
}) {
  const [state, action, isPending] = useActionState(upsertBarber, INITIAL);

  useEffect(() => {
    if (state.success) onSuccess();
  }, [state.success, onSuccess]);

  const fe = state.fieldErrors ?? {};

  return (
    <form action={action} className="space-y-4">
      {barber && <input type="hidden" name="id" value={barber.id} />}

      <Field label="Naam" error={fe.name}>
        <input
          name="name"
          type="text"
          defaultValue={barber?.name ?? ""}
          placeholder="Bijv. Ahmed"
          className={inputCls(!!fe.name)}
          required
        />
      </Field>

      <Field label="Bio (optioneel)" error={fe.bio}>
        <textarea
          name="bio"
          rows={2}
          defaultValue={barber?.bio ?? ""}
          placeholder="Korte omschrijving"
          className={cn(inputCls(!!fe.bio), "resize-none")}
        />
      </Field>

      <Field label="Avatar URL (optioneel)" error={fe.avatar_url}>
        <input
          name="avatar_url"
          type="url"
          defaultValue={barber?.avatar_url ?? ""}
          placeholder="https://..."
          className={inputCls(!!fe.avatar_url)}
        />
      </Field>

      {/* Behandelingen */}
      {allServices.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-700">
            Behandelingen
          </p>
          <div className="space-y-2 rounded-xl border border-neutral-200 p-3">
            {allServices.map((s) => (
              <label
                key={s.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-neutral-50"
              >
                <input
                  type="checkbox"
                  name="service_ids"
                  value={s.id}
                  defaultChecked={linkedServiceIds.includes(s.id)}
                  className="h-4 w-4 cursor-pointer rounded accent-neutral-900"
                />
                <span className="text-neutral-700">{s.name}</span>
                <span className="ml-auto text-xs text-neutral-400">
                  {s.duration_min} min
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

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
          {barber ? "Opslaan" : "Toevoegen"}
        </button>
      </div>
    </form>
  );
}

// ── BarbersManager ────────────────────────────────────────────

type BarberWithLinks = Barber & { service_ids: string[] };

export function BarbersManager({
  barbers,
  allServices,
}: {
  barbers: BarberWithLinks[];
  allServices: Service[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<BarberWithLinks | null>(null);
  const [toggling, startToggle] = useTransition();

  function openNew() { setEditing(null); setOpen(true); }
  function openEdit(b: BarberWithLinks) { setEditing(b); setOpen(true); }

  async function handleToggle(b: BarberWithLinks) {
    startToggle(async () => {
      await toggleBarberActive(b.id, !b.is_active);
    });
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">Medewerkers</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            {barbers.length} medewerker{barbers.length !== 1 ? "s" : ""}
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
      {barbers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center">
          <p className="text-sm text-neutral-400">Nog geen medewerkers. Voeg er een toe.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                {["Naam", "Bio", "Behandelingen", "Status", "Acties"].map((h) => (
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
              {barbers.map((b) => (
                <tr key={b.id} className="group hover:bg-neutral-50">
                  <td className="px-5 py-4 font-medium text-neutral-900">
                    {b.name}
                  </td>
                  <td className="px-5 py-4 text-neutral-500">
                    <p className="line-clamp-1 text-xs">
                      {b.bio ?? <span className="italic text-neutral-300">—</span>}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {b.service_ids.length === 0 ? (
                        <span className="text-xs italic text-neutral-300">Geen</span>
                      ) : (
                        b.service_ids.map((sid) => {
                          const svc = allServices.find((s) => s.id === sid);
                          return svc ? (
                            <span
                              key={sid}
                              className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
                            >
                              {svc.name}
                            </span>
                          ) : null;
                        })
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={b.is_active ? "confirmed" : "cancelled"} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(b)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
                        title="Bewerken"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleToggle(b)}
                        disabled={toggling}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-40"
                        title={b.is_active ? "Deactiveren" : "Activeren"}
                      >
                        {b.is_active
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
        title={editing ? "Medewerker bewerken" : "Medewerker toevoegen"}
        size="lg"
      >
        <BarberForm
          key={editing?.id ?? "new"}
          barber={editing}
          linkedServiceIds={editing?.service_ids ?? []}
          allServices={allServices}
          onSuccess={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
