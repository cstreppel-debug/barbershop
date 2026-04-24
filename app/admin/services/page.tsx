import { createClient } from "@/lib/supabase/server";
import { ServicesManager } from "@/components/admin/ServicesManager";
import type { Service } from "@/lib/types";

export default async function AdminServicesPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("services")
    .select("*")
    .order("name");

  return (
    <div className="p-6 lg:p-8">
      <ServicesManager services={(data ?? []) as Service[]} />
    </div>
  );
}
