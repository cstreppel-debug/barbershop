"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { AppointmentStatus } from "@/lib/types";

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<{ error?: string }> {
  const supabase = await createClient();

  // Controleer of gebruiker ingelogd is
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Niet geautoriseerd." };

  const { error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  return {};
}
