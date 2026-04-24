"use server";

import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { sendConfirmationEmail } from "./sendConfirmationEmail";

// ── Zod schema ────────────────────────────────────────────────

const schema = z.object({
  service_id: z.string().uuid(),
  barber_id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ongeldige datum"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Ongeldig tijdstip"),
  customer_name: z.string().min(2, "Naam moet minimaal 2 tekens bevatten"),
  customer_email: z.string().email("Voer een geldig e-mailadres in"),
  customer_phone: z.string().optional(),
  notes: z.string().optional(),
});

// ── State type ────────────────────────────────────────────────

export type CreateAppointmentState = {
  fieldErrors?: Partial<Record<keyof z.infer<typeof schema>, string[]>>;
  serverError?: string;
};

// ── Action ────────────────────────────────────────────────────

export async function createAppointment(
  _prevState: CreateAppointmentState,
  formData: FormData
): Promise<CreateAppointmentState> {
  // 1. Valideer invoer
  const parsed = schema.safeParse({
    service_id: formData.get("service_id"),
    barber_id: formData.get("barber_id"),
    date: formData.get("date"),
    time: formData.get("time"),
    customer_name: formData.get("customer_name"),
    customer_email: formData.get("customer_email"),
    customer_phone: formData.get("customer_phone") || undefined,
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { service_id, barber_id, date, time, customer_name, customer_email, customer_phone, notes } =
    parsed.data;

  const supabase = await createClient();

  // 2. Haal service op (duration + naam + prijs voor e-mail)
  const { data: service, error: serviceError } = await supabase
    .from("services")
    .select("duration_min, name, price")
    .eq("id", service_id)
    .single();

  if (serviceError || !service) {
    console.error("[createAppointment] Service lookup failed:", {
      service_id,
      code:    serviceError?.code,
      message: serviceError?.message,
    });
    return { serverError: "Behandeling kon niet worden opgehaald. Probeer opnieuw." };
  }

  // 3. Bereken starts_at en ends_at (UTC)
  const startsAt = new Date(`${date}T${time}:00.000Z`);
  const endsAt = new Date(startsAt.getTime() + service.duration_min * 60_000);

  // 4. Pre-genereer de UUID zodat we de afspraak niet hoeven terug te lezen
  //    (Supabase vereist SELECT-rechten voor .select() na .insert(), maar
  //    anonieme gebruikers hebben geen SELECT-policy op appointments).
  const appointmentId = randomUUID();

  const { error: insertError } = await supabase
    .from("appointments")
    .insert({
      id: appointmentId,
      service_id,
      barber_id,
      customer_name,
      customer_email,
      customer_phone: customer_phone ?? null,
      notes: notes ?? null,
      starts_at: startsAt.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "pending",
    });

  if (insertError) {
    console.error("[createAppointment] Supabase insert failed:", {
      code:    insertError.code,
      message: insertError.message,
      details: insertError.details,
      hint:    insertError.hint,
    });
    return {
      serverError:
        process.env.NODE_ENV === "development"
          ? `Supabase fout (${insertError.code}): ${insertError.message}${insertError.hint ? ` — ${insertError.hint}` : ""}`
          : "Er is iets misgegaan bij het opslaan van je afspraak. Probeer het opnieuw.",
    };
  }

  // Gebruik de pre-gegenereerde ID als bevestiging dat insert gelukt is
  const appointment = { id: appointmentId };

  // 5. Haal barbernaam op voor de e-mail
  const { data: barber } = await supabase
    .from("barbers")
    .select("name")
    .eq("id", barber_id)
    .single();

  // 6. Stuur bevestigingsmail (fire-and-forget — blokkeer redirect niet bij fout)
  void sendConfirmationEmail({
    to: customer_email,
    customerName: customer_name,
    serviceName: service.name,
    barberName: barber?.name ?? "Onbekend",
    date,
    time,
    price: service.price,
    appointmentId: appointment.id,
  });

  // 7. Succes → redirect (buiten try/catch)
  redirect(`/booking-confirmed?id=${appointment.id}`);
}
