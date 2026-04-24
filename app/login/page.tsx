import { redirect } from "next/navigation";
import { Scissors } from "lucide-react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Inloggen",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  // Al ingelogd → meteen doorsturen
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo / naam */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-900">
            <Scissors size={22} strokeWidth={1.75} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-neutral-900">
              Kapper De Zaak
            </h1>
            <p className="mt-0.5 text-sm text-neutral-500">Beheeromgeving</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-base font-semibold text-neutral-900">
            Inloggen
          </h2>
          <LoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Geen account? Neem contact op met de beheerder.
        </p>
      </div>
    </div>
  );
}
