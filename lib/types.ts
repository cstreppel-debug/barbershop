// ── Tabel-rijen ────────────────────────────────────────────

export type Service = {
  id: string;
  name: string;
  description: string | null;
  duration_min: number;
  price: number;
  is_active: boolean;
  created_at: string;
};

export type Barber = {
  id: string;
  name: string;
  bio: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
};

export type BarberService = {
  barber_id: string;
  service_id: string;
};

export type OpeningHours = {
  id: string;
  day_of_week: number; // 0 = zondag … 6 = zaterdag
  open_time: string;   // "HH:MM:SS"
  close_time: string;  // "HH:MM:SS"
  is_closed: boolean;
};

export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

export type Appointment = {
  id: string;
  service_id: string;
  barber_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  notes: string | null;
  created_at: string;
};

// ── Insert-typen (id / created_at weggelaten) ───────────────

export type ServiceInsert = Omit<Service, "id" | "created_at">;
export type BarberInsert = Omit<Barber, "id" | "created_at">;
export type AppointmentInsert = Omit<Appointment, "id" | "created_at">;
export type OpeningHoursInsert = Omit<OpeningHours, "id">;

// ── Join-typen (voor queries met relaties) ──────────────────

export type AppointmentWithRelations = Appointment & {
  service: Service;
  barber: Barber;
};

export type BarberWithServices = Barber & {
  barber_services: Array<{ service: Service }>;
};
