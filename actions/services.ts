"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// ── Typen ─────────────────────────────────────────────────────

export type ServiceActionState = {
  success?: boolean;
  fieldErrors?: Partial<Record<"name" | "description" | "duration_min" | "price", string[]>>;
  serverError?: string;
};

// ── Schema ────────────────────────────────────────────────────

const schema = z.object({
  id:          z.string().uuid().optional(),
  name:        z.string().min(2, "Naam moet minimaal 2 tekens bevatten"),
  description: z.string().optional(),
  duration_min: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(5, "Minimaal 5 minuten")),
  price: z
    .string()
    .transform((v) => parseFloat(v.replace(",", ".")))
    .pipe(z.number().min(0, "Prijs mag niet negatief zijn")),
});

// ── Upsert ────────────────────────────────────────────────────

export async function upsertService(
  _prev: ServiceActionState,
  formData: FormData
): Promise<ServiceActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { serverError: "Niet geautoriseerd." };

  const parsed = schema.safeParse({
    id:           formData.get("id") || undefined,
    name:         formData.get("name"),
    description:  formData.get("description") || undefined,
    duration_min: formData.get("duration_min"),
    price:        formData.get("price"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { id, ...fields } = parsed.data;

  if (id) {
    const { error } = await supabase
      .from("services")
      .update(fields)
      .eq("id", id);
    if (error) return { serverError: error.message };
  } else {
    const { error } = await supabase.from("services").insert(fields);
    if (error) return { serverError: error.message };
  }

  revalidatePath("/admin/services");
  revalidatePath("/admin");
  return { success: true };
}

// ── Toggle actief ─────────────────────────────────────────────

export async function toggleServiceActive(
  id: string,
  isActive: boolean
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Niet geautoriseerd." };

  const { error } = await supabase
    .from("services")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/services");
  revalidatePath("/admin");
  return {};
}
