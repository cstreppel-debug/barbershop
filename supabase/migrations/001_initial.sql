-- ============================================================
-- 001_initial.sql
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ============================================================
-- Tables
-- ============================================================

create table services (
  id           uuid primary key default uuid_generate_v4(),
  name         text        not null,
  description  text,
  duration_min integer     not null check (duration_min > 0),
  price        numeric     not null check (price >= 0),
  is_active    boolean     not null default true,
  created_at   timestamptz not null default now()
);

create table barbers (
  id          uuid primary key default uuid_generate_v4(),
  name        text        not null,
  bio         text,
  avatar_url  text,
  is_active   boolean     not null default true,
  created_at  timestamptz not null default now()
);

create table barber_services (
  barber_id   uuid not null references barbers(id)  on delete cascade,
  service_id  uuid not null references services(id) on delete cascade,
  primary key (barber_id, service_id)
);

create table opening_hours (
  id           uuid    primary key default uuid_generate_v4(),
  day_of_week  integer not null check (day_of_week between 0 and 6),
  open_time    time    not null,
  close_time   time    not null,
  is_closed    boolean not null default false,
  constraint opening_hours_day_unique unique (day_of_week),
  constraint opening_hours_times_check check (close_time > open_time)
);

create table appointments (
  id              uuid        primary key default uuid_generate_v4(),
  service_id      uuid        not null references services(id)  on delete restrict,
  barber_id       uuid        not null references barbers(id)   on delete restrict,
  customer_name   text        not null,
  customer_email  text        not null,
  customer_phone  text,
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  status          text        not null default 'pending'
                    check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes           text,
  created_at      timestamptz not null default now(),
  constraint appointments_times_check check (ends_at > starts_at)
);

-- Index voor agenda-queries
create index appointments_barber_time_idx
  on appointments (barber_id, starts_at, ends_at);

create index appointments_status_idx
  on appointments (status);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table services      enable row level security;
alter table barbers        enable row level security;
alter table barber_services enable row level security;
alter table opening_hours  enable row level security;
alter table appointments   enable row level security;

-- ------------------------------------------------------------
-- services
-- ------------------------------------------------------------
create policy "services: public read"
  on services for select
  using (true);

create policy "services: auth write"
  on services for insert
  with check (auth.role() = 'authenticated');

create policy "services: auth update"
  on services for update
  using (auth.role() = 'authenticated');

create policy "services: auth delete"
  on services for delete
  using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- barbers
-- ------------------------------------------------------------
create policy "barbers: public read"
  on barbers for select
  using (true);

create policy "barbers: auth write"
  on barbers for insert
  with check (auth.role() = 'authenticated');

create policy "barbers: auth update"
  on barbers for update
  using (auth.role() = 'authenticated');

create policy "barbers: auth delete"
  on barbers for delete
  using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- barber_services
-- ------------------------------------------------------------
create policy "barber_services: public read"
  on barber_services for select
  using (true);

create policy "barber_services: auth write"
  on barber_services for insert
  with check (auth.role() = 'authenticated');

create policy "barber_services: auth delete"
  on barber_services for delete
  using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- opening_hours
-- ------------------------------------------------------------
create policy "opening_hours: public read"
  on opening_hours for select
  using (true);

create policy "opening_hours: auth write"
  on opening_hours for insert
  with check (auth.role() = 'authenticated');

create policy "opening_hours: auth update"
  on opening_hours for update
  using (auth.role() = 'authenticated');

create policy "opening_hours: auth delete"
  on opening_hours for delete
  using (auth.role() = 'authenticated');

-- ------------------------------------------------------------
-- appointments
-- ------------------------------------------------------------
create policy "appointments: public insert"
  on appointments for insert
  with check (true);

create policy "appointments: auth read"
  on appointments for select
  using (auth.role() = 'authenticated');

create policy "appointments: auth update"
  on appointments for update
  using (auth.role() = 'authenticated');

create policy "appointments: auth delete"
  on appointments for delete
  using (auth.role() = 'authenticated');
