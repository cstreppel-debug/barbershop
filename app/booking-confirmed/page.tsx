import Link from "next/link";
import { Check, CalendarDays, Clock, User, Euro, Scissors } from "lucide-react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { Service, Barber, Appointment } from "@/lib/types";

export const metadata: Metadata = {
  title: "Afspraak bevestigd",
  description: "Je afspraak bij Kapper De Zaak is bevestigd.",
  robots: { index: false, follow: false },
};

function formatDateNL(isoStr: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(isoStr));
}

function formatTime(isoStr: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
  }).format(new Date(isoStr));
}

type AppointmentFull = Appointment & {
  service: Service;
  barber: Barber;
};

export default async function BookingConfirmedPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  let appointment: AppointmentFull | null = null;

  if (id) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("appointments")
      .select("*, service:services(*), barber:barbers(*)")
      .eq("id", id)
      .single();
    appointment = data as AppointmentFull | null;
  }

  const shortId = id ? id.split("-")[0].toUpperCase() : null;

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      {/* ── Vinkmark animatie ─────────────────────────────── */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="animate-pop-in mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-900">
          <Check
            size={36}
            strokeWidth={2.5}
            className="text-white"
          />
        </div>

        <h1
          className="animate-fade-up text-2xl font-semibold text-neutral-900"
          style={{ animationDelay: "120ms" }}
        >
          Afspraak bevestigd!
        </h1>
        <p
          className="animate-fade-up mt-2 text-sm leading-relaxed text-neutral-500"
          style={{ animationDelay: "200ms" }}
        >
          Je ontvangt een bevestiging op je e-mailadres.
        </p>

        {shortId && (
          <p
            className="animate-fade-up mt-3 rounded-lg bg-neutral-100 px-4 py-1.5 font-mono text-xs text-neutral-400"
            style={{ animationDelay: "260ms" }}
          >
            #{shortId}
          </p>
        )}
      </div>

      {/* ── Afspraakdetails ───────────────────────────────── */}
      {appointment ? (
        <div
          className="animate-fade-up overflow-hidden rounded-2xl border border-neutral-200 bg-white"
          style={{ animationDelay: "320ms" }}
        >
          <div className="border-b border-neutral-100 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              Jouw afspraak
            </p>
          </div>

          <dl className="divide-y divide-neutral-100">
            <DetailRow icon={<Scissors size={14} strokeWidth={1.75} />} label="Behandeling">
              <span className="font-medium">{appointment.service.name}</span>
              <span className="ml-2 text-neutral-400">
                ({formatDuration(appointment.service.duration_min)})
              </span>
            </DetailRow>

            <DetailRow icon={<User size={14} strokeWidth={1.75} />} label="Kapper">
              {appointment.barber.name}
            </DetailRow>

            <DetailRow icon={<CalendarDays size={14} strokeWidth={1.75} />} label="Datum">
              <span className="capitalize">
                {formatDateNL(appointment.starts_at)}
              </span>
            </DetailRow>

            <DetailRow icon={<Clock size={14} strokeWidth={1.75} />} label="Tijd">
              {formatTime(appointment.starts_at)}
            </DetailRow>

            <DetailRow icon={<Euro size={14} strokeWidth={1.75} />} label="Prijs">
              <span className="font-semibold">
                {formatPrice(appointment.service.price)}
              </span>
            </DetailRow>
          </dl>

          {/* Klantgegevens */}
          <div className="border-t border-neutral-100 bg-neutral-50 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
              Op naam van
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-900">
              {appointment.customer_name}
            </p>
            <p className="text-sm text-neutral-500">{appointment.customer_email}</p>
            {appointment.customer_phone && (
              <p className="text-sm text-neutral-500">{appointment.customer_phone}</p>
            )}
            {appointment.notes && (
              <p className="mt-2 text-sm italic text-neutral-400">
                &ldquo;{appointment.notes}&rdquo;
              </p>
            )}
          </div>
        </div>
      ) : (
        // Fallback als appointment niet gevonden of geen id
        <div
          className="animate-fade-up rounded-2xl border border-neutral-200 bg-neutral-50 p-6 text-center"
          style={{ animationDelay: "320ms" }}
        >
          <p className="text-sm text-neutral-500">
            Je afspraak is opgeslagen. Check je e-mail voor alle details.
          </p>
        </div>
      )}

      {/* ── CTA ──────────────────────────────────────────── */}
      <div
        className="animate-fade-up mt-8 text-center"
        style={{ animationDelay: "400ms" }}
      >
        <Link
          href="/"
          className="inline-flex rounded-2xl bg-neutral-900 px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
        >
          Nieuwe afspraak maken
        </Link>
      </div>
    </div>
  );
}

// ── Hulpcomponent ─────────────────────────────────────────────

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 px-5 py-3.5">
      <span className="mt-0.5 text-neutral-400">{icon}</span>
      <dt className="w-24 shrink-0 text-sm text-neutral-500">{label}</dt>
      <dd className="text-sm text-neutral-900">{children}</dd>
    </div>
  );
}
