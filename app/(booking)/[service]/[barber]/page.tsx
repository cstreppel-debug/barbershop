import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Clock, Euro } from "lucide-react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { DateTimePicker } from "@/components/booking/DateTimePicker";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { Barber, Service, OpeningHours } from "@/lib/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; barber: string }>;
}): Promise<Metadata> {
  const { service: serviceId, barber: barberId } = await params;
  const supabase = await createClient();
  const [{ data: service }, { data: barber }] = await Promise.all([
    supabase.from("services").select("name").eq("id", serviceId).single(),
    supabase.from("barbers").select("name").eq("id", barberId).single(),
  ]);

  const title =
    service && barber
      ? `${service.name} bij ${barber.name} — kies datum & tijd`
      : "Kies datum & tijd";

  return { title };
}

export default async function ChooseDateTimePage({
  params,
}: {
  params: Promise<{ service: string; barber: string }>;
}) {
  const { service: serviceId, barber: barberId } = await params;
  const supabase = await createClient();

  const [
    { data: service },
    { data: barber },
    { data: hoursRows },
  ] = await Promise.all([
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

    supabase
      .from("opening_hours")
      .select("day_of_week, is_closed"),
  ]);

  if (!service || !barber) notFound();

  const closedDayNumbers = (hoursRows ?? [])
    .filter((h) => h.is_closed)
    .map((h) => h.day_of_week);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <StepIndicator current={3} />

      <Link
        href={`/${serviceId}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-neutral-700"
      >
        <ChevronLeft size={14} />
        Andere kapper kiezen
      </Link>

      {/* Samenvatting */}
      <div className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="mb-3 text-xs font-medium uppercase tracking-widest text-neutral-400">
          Jouw keuze
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-neutral-900">
              {(service as Service).name}
            </p>
            <p className="mt-0.5 text-sm text-neutral-500">
              bij {(barber as Barber).name}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="flex items-center gap-1 text-sm text-neutral-500">
              <Clock size={13} strokeWidth={1.75} />
              {formatDuration((service as Service).duration_min)}
            </span>
            <span className="flex items-center gap-1 text-sm font-medium text-neutral-900">
              <Euro size={13} strokeWidth={1.75} />
              {formatPrice((service as Service).price).replace("€", "").trim()}
            </span>
          </div>
        </div>
      </div>

      <h2 className="mb-5 text-sm font-medium text-neutral-500">
        Kies datum & tijd
      </h2>

      <DateTimePicker
        serviceId={serviceId}
        barberId={barberId}
        closedDayNumbers={closedDayNumbers}
      />
    </div>
  );
}
