-- Throune username-only MVP. This schema is intentionally public: usernames
-- are not authentication and must not be treated as secrets.
create table if not exists public.profiles (
  username text primary key check (username = lower(username) and username ~ '^[a-z0-9_]{3,24}$'),
  created_at timestamptz not null default now()
);

create table if not exists public.runs (
  id uuid primary key,
  username text not null references public.profiles(username) on update cascade on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  note text not null default '' check (char_length(note) <= 2000),
  points jsonb not null check (jsonb_typeof(points) = 'array'),
  started_at timestamptz not null,
  ended_at timestamptz not null,
  demo boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists runs_username_started_idx on public.runs(username, started_at desc);

alter table public.profiles enable row level security;
alter table public.runs enable row level security;

-- Username-only access is intentionally public. Anyone can impersonate a username.
drop policy if exists "Public can read profiles" on public.profiles;
create policy "Public can read profiles" on public.profiles for select to anon using (true);
drop policy if exists "Public can claim profiles" on public.profiles;
create policy "Public can claim profiles" on public.profiles for insert to anon with check (true);

drop policy if exists "Public can read runs" on public.runs;
create policy "Public can read runs" on public.runs for select to anon using (true);
drop policy if exists "Public can create runs" on public.runs;
create policy "Public can create runs" on public.runs for insert to anon with check (true);
drop policy if exists "Public can delete runs" on public.runs;
create policy "Public can delete runs" on public.runs for delete to anon using (true);

grant select, insert on public.profiles to anon;
grant select, insert, delete on public.runs to anon;

