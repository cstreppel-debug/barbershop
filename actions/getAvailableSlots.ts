"use server";

import { createClient } from "@/lib/supabase/server";

// Tijden worden behandeld als UTC. De opening_hours-tijden in de DB
// zijn UTC-tijden, appointments worden opgeslagen als UTC timestamptz.

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  return [
    Math.floor(minutes / 60).toString().padStart(2, "0"),
    (minutes % 60).toString().padStart(2, "0"),
  ].join(":");
}

export async function getAvailableSlots(
  serviceId: string,
  barberId: string,
  dateStr: string // "YYYY-MM-DD"
): Promise<string[]> {
  const supabase = await createClient();

  // Gebruik T12:00:00Z zodat de dag nooit verschuift bij UTC-conversie
  const dayOfWeek = new Date(`${dateStr}T12:00:00Z`).getUTCDay();

  const [
    { data: service },
    { data: hours },
    { data: existing },
  ] = await Promise.all([
    supabase
      .from("services")
      .select("duration_min")
      .eq("id", serviceId)
      .single(),

    supabase
      .from("opening_hours")
      .select("open_time, close_time, is_closed")
      .eq("day_of_week", dayOfWeek)
      .single(),

    supabase
      .from("appointments")
      .select("starts_at, ends_at")
      .eq("barber_id", barberId)
      .neq("status", "cancelled")
      .gte("starts_at", `${dateStr}T00:00:00+00:00`)
      .lt("starts_at", `${dateStr}T23:59:59+00:00`),
  ]);

  if (!service || !hours || hours.is_closed) return [];

  const openMin = timeToMinutes(hours.open_time);
  const closeMin = timeToMinutes(hours.close_time);
  const duration = service.duration_min;

  // Genereer alle mogelijke slots
  const slots: string[] = [];
  for (let t = openMin; t + duration <= closeMin; t += duration) {
    slots.push(minutesToTime(t));
  }

  // Bestaande boekingen omzetten naar UTC minuten-ranges
  const booked = (existing ?? []).map((a) => ({
    start: timeToMinutes(new Date(a.starts_at).toISOString().slice(11, 16)),
    end: timeToMinutes(new Date(a.ends_at).toISOString().slice(11, 16)),
  }));

  // Filter slots die overlappen met een bestaande boeking
  return slots.filter((slot) => {
    const s = timeToMinutes(slot);
    const e = s + duration;
    return !booked.some((r) => r.start < e && r.end > s);
  });
}
