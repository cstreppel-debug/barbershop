-- Additional performance indexes
-- Run after 001_initial.sql

-- Lookup appointments by start time (calendar views, availability checks)
CREATE INDEX IF NOT EXISTS appointments_starts_at_idx
  ON appointments (starts_at);

-- Filter services/barbers by active status (booking flow landing page)
CREATE INDEX IF NOT EXISTS services_is_active_idx
  ON services (is_active);

CREATE INDEX IF NOT EXISTS barbers_is_active_idx
  ON barbers (is_active);

-- Look up all appointments for a customer (future: manage bookings by email)
CREATE INDEX IF NOT EXISTS appointments_customer_email_idx
  ON appointments (customer_email);
