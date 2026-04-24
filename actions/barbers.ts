"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// ── Typen ─────────────────────────────────────────────────────

export type BarberActionState = {
  success?: boolean;
  fieldErrors?: Partial<Record<"name" | "bio" | "avatar_url", string[]>>;
  serverError?: string;
};

// ── Schema ────────────────────────────────────────────────────

const schema = z.object({
  id:         z.string().uuid().optional(),
  name:       z.string().min(2, "Naam moet minimaal 2 tekens bevatten"),
  bio:        z.string().optional(),
  avatar_url: z.string().url("Voer een geldige URL in").optional().or(z.literal("")),
});

// ── Upsert (inclusief barber_services) ───────────────────────

export async function upsertBarber(
  _prev: BarberActionState,
  formData: FormData
): Promise<BarberActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { serverError: "Niet geautoriseerd." };

  const parsed = schema.safeParse({
    id:         formData.get("id") || undefined,
    name:       formData.get("name"),
    bio:        formData.get("bio") || undefined,
    avatar_url: formData.get("avatar_url") || undefined,
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const serviceIds = formData.getAll("service_ids") as string[];
  const { id, avatar_url, ...fields } = parsed.data;

  let barberId = id;

  if (id) {
    const { error } = await supabase
      .from("barbers")
      .update({ ...fields, avatar_url: avatar_url || null })
      .eq("id", id);
    if (error) return { serverError: error.message };
  } else {
    const { data, error } = await supabase
      .from("barbers")
      .insert({ ...fields, avatar_url: avatar_url || null })
      .select("id")
      .single();
    if (error || !data) return { serverError: error?.message ?? "Kon medewerker niet aanmaken." };
    barberId = data.id;
  }

  // Sync barber_services: verwijder alle bestaande en voeg nieuwe toe
  const { error: delError } = await supabase
    .from("barber_services")
    .delete()
    .eq("barber_id", barberId);

  if (delError) return { serverError: delError.message };

  if (serviceIds.length > 0) {
    const { error: insError } = await supabase
      .from("barber_services")
      .insert(serviceIds.map((sid) => ({ barber_id: barberId, service_id: sid })));
    if (insError) return { serverError: insError.message };
  }

  revalidatePath("/admin/barbers");
  revalidatePath("/admin");
  return { success: true };
}

// ── Toggle actief ─────────────────────────────────────────────

export async function toggleBarberActive(
  id: string,
  isActive: boolean
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Niet geautoriseerd." };

  const { error } = await supabase
    .from("barbers")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/barbers");
  revalidatePath("/admin");
  return {};
}
