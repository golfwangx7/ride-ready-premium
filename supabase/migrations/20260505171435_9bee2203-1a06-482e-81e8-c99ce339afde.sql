
create table public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  user_handle text not null,
  user_initial text not null,
  vehicle_type text not null check (vehicle_type in ('moto','car')),
  location text not null,
  lat double precision not null,
  lng double precision not null,
  distance_km numeric(8,2) not null,
  duration_minutes integer not null,
  avg_speed_kmh integer not null,
  likes integer not null default 0,
  map_image text,
  created_at timestamptz not null default now()
);

alter table public.feed_posts enable row level security;

-- Public read-only feed
create policy "Anyone can read feed posts"
  on public.feed_posts for select
  using (true);

create index feed_posts_vehicle_type_idx on public.feed_posts (vehicle_type);
create index feed_posts_created_at_idx on public.feed_posts (created_at desc);
