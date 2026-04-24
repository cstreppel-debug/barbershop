import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, Euro, CalendarDays, User } from "lucide-react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { BookingForm } from "@/components/booking/BookingForm";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { Service, Barber } from "@/lib/types";

export const metadata: Metadata = {
  title: "Bevestig je afspraak",
  description: "Controleer de details en bevestig je boeking bij Kapper De Zaak.",
  robots: { index: false, follow: false },
};

function formatDateNL(dateStr: string): string {
  const date = new Date(`${dateStr}T12:00:00Z`);
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export default async function ConfirmBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ service: string; barber: string }>;
  searchParams: Promise<{ date?: string; time?: string }>;
}) {
  const [{ service: serviceId, barber: barberId }, { date, time }] =
    await Promise.all([params, searchParams]);

  // Ontbrekende searchParams → stuur terug naar stap 3
  if (!date || !time) {
    redirect(`/${serviceId}/${barberId}`);
  }

  const supabase = await createClient();

  const [{ data: service }, { data: barber }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("id", serviceId)
      .eq("is_active", true)
      .single(),
    supabase
      .from("barbers")
      .select("*")
      .eq("id", barberId)
      .eq("is_active", true)
      .single(),
  ]);

  if (!service || !barber) notFound();

  const s = service as Service;
  const b = barber as Barber;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <StepIndicator current={4} />

      <Link
        href={`/${serviceId}/${barberId}?date=${date}&time=${time}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-neutral-700"
      >
        <ChevronLeft size={14} />
        Datum of tijd aanpassen
      </Link>

      {/* ── Samenvatting ─────────────────────────────────────── */}
      <div className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50">
        <div className="border-b border-neutral-200 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            Overzicht
          </p>
        </div>
        <dl className="divide-y divide-neutral-200">
          <SummaryRow
            icon={<Clock size={14} strokeWidth={1.75} />}
            label="Behandeling"
            value={
              <span>
                {s.name}{" "}
                <span className="text-neutral-400">
                  ({formatDuration(s.duration_min)})
                </span>
              </span>
            }
          />
          <SummaryRow
            icon={<User size={14} strokeWidth={1.75} />}
            label="Kapper"
            value={b.name}
          />
          <SummaryRow
            icon={<CalendarDays size={14} strokeWidth={1.75} />}
            label="Datum"
            value={
              <span className="capitalize">{formatDateNL(date)}</span>
            }
          />
          <SummaryRow
            icon={<Clock size={14} strokeWidth={1.75} />}
            label="Tijd"
            value={time}
          />
          <SummaryRow
            icon={<Euro size={14} strokeWidth={1.75} />}
            label="Prijs"
            value={
              <span className="font-semibold text-neutral-900">
                {formatPrice(s.price)}
              </span>
            }
          />
        </dl>
      </div>

      {/* ── Formulier ────────────────────────────────────────── */}
      <h2 className="mb-5 text-sm font-medium text-neutral-500">
        Jouw gegevens
      </h2>

      <BookingForm
        serviceId={serviceId}
        barberId={barberId}
        date={date}
        time={time}
      />
    </div>
  );
}

// ── Hulpcomponent ─────────────────────────────────────────────

function SummaryRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 px-5 py-3.5">
      <span className="mt-0.5 text-neutral-400">{icon}</span>
      <dt className="w-24 shrink-0 text-sm text-neutral-500">{label}</dt>
      <dd className="text-sm text-neutral-900">{value}</dd>
    </div>
  );
}
