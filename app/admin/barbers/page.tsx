import { createClient } from "@/lib/supabase/server";
import { BarbersManager } from "@/components/admin/BarbersManager";
import type { Barber, Service } from "@/lib/types";

export default async function AdminBarbersPage() {
  const supabase = await createClient();

  const [{ data: barberRows }, { data: serviceRows }, { data: linkRows }] =
    await Promise.all([
      supabase.from("barbers").select("*").order("name"),
      supabase.from("services").select("*").eq("is_active", true).order("name"),
      supabase.from("barber_services").select("barber_id, service_id"),
    ]);

  // Verrijk elke barber met een `service_ids` array
  const barbers = ((barberRows ?? []) as Barber[]).map((b) => ({
    ...b,
    service_ids: (linkRows ?? [])
      .filter((l) => l.barber_id === b.id)
      .map((l) => l.service_id),
  }));

  return (
    <div className="p-6 lg:p-8">
      <BarbersManager
        barbers={barbers}
        allServices={(serviceRows ?? []) as Service[]}
      />
    </div>
  );
}
