import { notFound } from "next/navigation";
import { Clock, Euro, ChevronLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { BarberCard, NoPreferenceButton } from "@/components/booking/BarberCard";
import { formatPrice, formatDuration } from "@/lib/utils";
import type { Barber } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service: serviceId } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("name")
    .eq("id", serviceId)
    .single();

  return {
    title: data ? `Kies kapper voor ${data.name}` : "Kies een kapper",
    description: data
      ? `Kies je kapper voor ${data.name} bij Kapper De Zaak.`
      : "Kies een kapper bij Kapper De Zaak.",
  };
}

export default async function ChooseBarberPage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service: serviceId } = await params;
  const supabase = await createClient();

  // Parallelle fetches — service lookup en barbers met de koppeltabel
  const [{ data: service }, { data: barberRows }] = await Promise.all([
    supabase
      .from("services")
      .select("*")
      .eq("id", serviceId)
      .eq("is_active", true)
      .single(),

    supabase
      .from("barber_services")
      .select("barber:barbers(*)")
      .eq("service_id", serviceId),
  ]);

  if (!service) notFound();

  // Filter actieve barbers en pak de geneste objecten uit de join.
  // Supabase typt de geneste relatie als any[] zonder gegenereerde DB-types,
  // vandaar de cast via unknown.
  const barbers = (barberRows ?? [])
    .map((row) => (row.barber as unknown) as Barber | null)
    .filter((b): b is Barber => b !== null && b.is_active);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <StepIndicator current={2} />

      {/* Terug */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1 text-sm text-neutral-400 transition-colors hover:text-neutral-700"
      >
        <ChevronLeft size={14} />
        Andere behandeling kiezen
      </Link>

      {/* Samenvatting gekozen service */}
      <div className="mb-8 rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-neutral-400">
          Gekozen behandeling
        </p>
        <p className="text-base font-semibold text-neutral-900">{service.name}</p>
        {service.description && (
          <p className="mt-1 text-sm text-neutral-500">{service.description}</p>
        )}
        <div className="mt-3 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-sm text-neutral-500">
            <Clock size={13} strokeWidth={1.75} />
            {formatDuration(service.duration_min)}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-neutral-900">
            <Euro size={13} strokeWidth={1.75} />
            {formatPrice(service.price).replace("€", "").trim()}
          </span>
        </div>
      </div>

      {/* Barber selectie */}
      <h2 className="mb-5 text-sm font-medium text-neutral-500">
        Kies je kapper
      </h2>

      {barbers.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Er zijn momenteel geen kappers beschikbaar voor deze behandeling.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber) => (
            <BarberCard
              key={barber.id}
              barber={barber}
              href={`/${serviceId}/${barber.id}`}
            />
          ))}
          <NoPreferenceButton
            serviceId={serviceId}
            barberIds={barbers.map((b) => b.id)}
          />
        </div>
      )}
    </div>
  );
}
