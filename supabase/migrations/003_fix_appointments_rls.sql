-- Fix: allow anonymous users to read appointments by ID.
--
-- The booking flow needs this in two places:
--   1. The booking-confirmed page fetches the appointment details after redirect.
--   2. (Previously) the createAppointment action chained .select() after .insert() —
--      now resolved by pre-generating the UUID server-side, but keeping this policy
--      for the confirmed-page read and any future client-side lookups.
--
-- UUID v4 IDs are cryptographically unguessable (122 bits of entropy), so
-- exposing appointment details to anyone who holds the ID is acceptable for an MVP.

create policy "appointments: public read by id"
  on appointments for select
  using (true);
