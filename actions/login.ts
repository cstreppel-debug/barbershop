"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  email: z.string().email("Voer een geldig e-mailadres in"),
  password: z.string().min(1, "Wachtwoord is verplicht"),
});

export type LoginState = {
  fieldErrors?: { email?: string[]; password?: string[] };
  serverError?: string;
};

export async function login(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    // Geef nooit specifieke "user not found" vs "wrong password" info terug
    return {
      serverError: "E-mailadres of wachtwoord is onjuist.",
    };
  }

  // redirect() buiten try/catch — Next.js gooit intern een NEXT_REDIRECT
  redirect("/admin");
}
