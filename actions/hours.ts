"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { OpeningHours } from "@/lib/types";
import { DEFAULTS, DAY_NAMES } from "@/lib/hours-config";

// ── Seed (alleen als de tabel leeg is) ───────────────────────

export async function seedHoursIfEmpty(): Promise<OpeningHours[]> {
  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("opening_hours")
    .select("*")
    .order("day_of_week");

  if (existing && existing.length > 0) return existing as OpeningHours[];

  const { data: inserted } = await supabase
    .from("opening_hours")
    .insert(DEFAULTS)
    .select("*")
    .order("day_of_week");

  return (inserted ?? []) as OpeningHours[];
}

// ── State type ────────────────────────────────────────────────

export type HoursActionState = {
  success?: boolean;
  serverError?: string;
  fieldError?: string;
};

// ── Validatieschema voor één dag ──────────────────────────────

const daySchema = z.object({
  id:          z.string().uuid(),
  day_of_week: z.coerce.number().int().min(0).max(6),
  is_closed:   z.boolean(),
  open_time:   z.string().regex(/^\d{2}:\d{2}$/),
  close_time:  z.string().regex(/^\d{2}:\d{2}$/),
}).refine(
  (d) => d.is_closed || d.open_time < d.close_time,
  { message: "Sluitingstijd moet na openingstijd liggen" }
);

// ── Bulk upsert ───────────────────────────────────────────────

export async function saveHours(
  _prev: HoursActionState,
  formData: FormData
): Promise<HoursActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { serverError: "Niet geautoriseerd." };

  // Elke dag levert velden: id_{dow}, is_closed_{dow}, open_{dow}, close_{dow}
  const days = [0, 1, 2, 3, 4, 5, 6];
  const rows = days.map((dow) => ({
    id:          formData.get(`id_${dow}`) as string,
    day_of_week: dow,
    is_closed:   formData.get(`is_closed_${dow}`) === "true",
    open_time:   (formData.get(`open_${dow}`) as string) || "09:00",
    close_time:  (formData.get(`close_${dow}`) as string) || "18:00",
  }));

  for (const row of rows) {
    const result = daySchema.safeParse(row);
    if (!result.success) {
      return {
        fieldError: `${DAY_NAMES[row.day_of_week]}: ${result.error.issues[0].message}`,
      };
    }
  }

  // Upsert op basis van id (alle rijen bestaan na seed)
  const { error } = await supabase
    .from("opening_hours")
    .upsert(rows, { onConflict: "id" });

  if (error) return { serverError: error.message };

  revalidatePath("/admin/hours");
  revalidatePath("/admin");
  return { success: true };
}

