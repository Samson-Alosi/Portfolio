create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  first_name text,
  last_name text,
  email text,
  interest text,
  message text,
  source text default 'website',
  created_at timestamptz not null default now()
);

alter table public.inquiries enable row level security;

create policy "Allow public inserts"
  on public.inquiries
  for insert
  with check (true);

create policy "Allow authenticated reads"
  on public.inquiries
  for select
  using (auth.uid() is not null);

create index if not exists inquiries_created_at_idx
  on public.inquiries (created_at desc);
