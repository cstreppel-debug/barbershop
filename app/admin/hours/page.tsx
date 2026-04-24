import { seedHoursIfEmpty } from "@/actions/hours";
import { HoursEditor } from "@/components/admin/HoursEditor";

export default async function AdminHoursPage() {
  // Seed standaardwaarden als de tabel nog leeg is,
  // retourneert altijd de actuele rijen gesorteerd op day_of_week.
  const hours = await seedHoursIfEmpty();

  return (
    <div className="p-6 lg:p-8">
      <HoursEditor hours={hours} />
    </div>
  );
}
