import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ServiceCard } from "@/components/booking/ServiceCard";

export const metadata: Metadata = {
  title: "Kies een behandeling",
  description:
    "Bekijk alle beschikbare behandelingen bij Kapper De Zaak en maak online een afspraak.",
};

export default async function ChooseServicePage() {
  const supabase = await createClient();

  const { data: services, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    throw new Error(error.message);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <header className="mb-10">
        <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
          Online boeking
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-neutral-900">
          Kapper De Zaak
        </h1>
      </header>

      {services.length === 0 ? (
        <p className="text-sm text-neutral-500">
          Er zijn momenteel geen behandelingen beschikbaar.
        </p>
      ) : (
        <>
          <h2 className="mb-5 text-sm font-medium text-neutral-500">
            Kies een behandeling
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
