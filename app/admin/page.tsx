import { Calendar, TrendingUp, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { AppointmentTable } from "@/components/admin/AppointmentTable";
import type { AppointmentWithRelations, Barber } from "@/lib/types";

function utcDayBoundary(offsetDays: number): string {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString();
}

function formatDayHeader(isoStr: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(isoStr));
}

// ── Metric card ───────────────────────────────────────────────

function MetricCard({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400">
          {label}
        </p>
        <p className="mt-0.5 text-2xl font-semibold text-neutral-900">
          {value}
        </p>
        {sub && <p className="mt-0.5 text-xs text-neutral-400">{sub}</p>}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const todayStart = utcDayBoundary(0);
  const weekEnd = utcDayBoundary(8); // vandaag t/m 7 dagen later (exclusief)
  const tomorrowStart = utcDayBoundary(1);

  const [{ data: raw }, { data: barbers }] = await Promise.all([
    supabase
      .from("appointments")
      .select("*, service:services(*), barber:barbers(*)")
      .gte("starts_at", todayStart)
      .lt("starts_at", weekEnd)
      .order("starts_at"),

    supabase
      .from("barbers")
      .select("*")
      .eq("is_active", true)
      .order("name"),
  ]);

  const appointments = (raw ?? []) as AppointmentWithRelations[];
  const allBarbers = (barbers ?? []) as Barber[];

  const todayCount = appointments.filter(
    (a) => a.starts_at >= todayStart && a.starts_at < tomorrowStart
  ).length;

  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  const nextAppt = appointments.find((a) => a.starts_at >= new Date().toISOString());

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-neutral-900">Dashboard</h1>
        <p className="mt-0.5 text-sm capitalize text-neutral-500">
          {formatDayHeader(todayStart)}
        </p>
      </div>

      {/* Metrics */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard
          icon={<Calendar size={18} strokeWidth={1.75} />}
          label="Vandaag"
          value={todayCount}
          sub={todayCount === 1 ? "afspraak" : "afspraken"}
        />
        <MetricCard
          icon={<TrendingUp size={18} strokeWidth={1.75} />}
          label="In afwachting"
          value={pendingCount}
          sub="nog te bevestigen"
        />
        <MetricCard
          icon={<Clock size={18} strokeWidth={1.75} />}
          label="Volgende afspraak"
          value={
            nextAppt
              ? new Intl.DateTimeFormat("nl-NL", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "UTC",
                }).format(new Date(nextAppt.starts_at))
              : "—"
          }
          sub={nextAppt ? nextAppt.service.name : "geen geplande afspraken"}
        />
      </div>

      {/* Tabel */}
      <div>
        <h2 className="mb-4 text-sm font-medium text-neutral-500">
          Afspraken — vandaag & komende 7 dagen
        </h2>
        <AppointmentTable
          appointments={appointments}
          barbers={allBarbers}
        />
      </div>
    </div>
  );
}
