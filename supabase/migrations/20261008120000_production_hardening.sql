-- =====================================================================
-- AUTOFLEXII production hardening
--  1. Admin allow-list (only listed users can manage car listings)
--  2. `enquiries` table — backup record of every website form submission
--  3. `sell-requests` storage bucket for photos uploaded with "Sell your car"
--  4. Lock down car photo buckets to admins
--
-- Apply with:  supabase db push      (or paste into Supabase → SQL Editor)
-- Then make sure your admin login is in public.admin_users (see bottom).
-- =====================================================================

-- 1. Admins ------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;

drop policy if exists "Admins can see their own row" on public.admin_users;
create policy "Admins can see their own row" on public.admin_users
  for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Cars: previously ANY signed-up user could insert/update/delete.
drop policy if exists "Authenticated users can insert cars" on public.cars;
drop policy if exists "Authenticated users can update cars" on public.cars;
drop policy if exists "Authenticated users can delete cars" on public.cars;
drop policy if exists "Admins can insert cars" on public.cars;
drop policy if exists "Admins can update cars" on public.cars;
drop policy if exists "Admins can delete cars" on public.cars;

create policy "Admins can insert cars" on public.cars
  for insert to authenticated with check (public.is_admin());
create policy "Admins can update cars" on public.cars
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete cars" on public.cars
  for delete to authenticated using (public.is_admin());

-- 2. Enquiries ---------------------------------------------------------
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  kind text not null check (kind in ('buy', 'sell', 'car-spa', 'inspection', 'contact')),
  name text not null check (char_length(name) between 2 and 80),
  phone text not null check (phone ~ '^[6-9][0-9]{9}$'),
  email text check (email is null or char_length(email) <= 120),
  subject text check (subject is null or char_length(subject) <= 300),
  details jsonb not null default '{}'::jsonb check (pg_column_size(details) < 16000),
  photo_urls text[] check (photo_urls is null or cardinality(photo_urls) <= 10),
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed', 'not_configured')),
  created_at timestamptz not null default now()
);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
alter table public.enquiries enable row level security;

drop policy if exists "Anyone can submit an enquiry" on public.enquiries;
drop policy if exists "Admins can read enquiries" on public.enquiries;
drop policy if exists "Admins can update enquiries" on public.enquiries;
drop policy if exists "Admins can delete enquiries" on public.enquiries;

-- Visitors can only INSERT (write-only); they can never read other people's enquiries.
create policy "Anyone can submit an enquiry" on public.enquiries
  for insert to anon, authenticated with check (true);
create policy "Admins can read enquiries" on public.enquiries
  for select to authenticated using (public.is_admin());
create policy "Admins can update enquiries" on public.enquiries
  for update to authenticated using (public.is_admin());
create policy "Admins can delete enquiries" on public.enquiries
  for delete to authenticated using (public.is_admin());

-- 3. Seller photo uploads ---------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sell-requests', 'sell-requests', true, 10485760, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can upload sell request photos" on storage.objects;
drop policy if exists "Admins manage sell request photos" on storage.objects;
create policy "Anyone can upload sell request photos" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'sell-requests');
create policy "Admins manage sell request photos" on storage.objects
  for delete to authenticated using (bucket_id = 'sell-requests' and public.is_admin());

-- 4. Car photo buckets: only admins may write --------------------------
-- (`car-photos` from the first migration, `autoflexii` used by the admin page)
insert into storage.buckets (id, name, public)
values ('autoflexii', 'autoflexii', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can upload car photos" on storage.objects;
drop policy if exists "Anyone can update car photos" on storage.objects;
drop policy if exists "Anyone can delete car photos" on storage.objects;
drop policy if exists "Admins upload car photos" on storage.objects;
drop policy if exists "Admins update car photos" on storage.objects;
drop policy if exists "Admins delete car photos" on storage.objects;

create policy "Admins upload car photos" on storage.objects
  for insert to authenticated with check (bucket_id in ('car-photos', 'autoflexii') and public.is_admin());
create policy "Admins update car photos" on storage.objects
  for update to authenticated using (bucket_id in ('car-photos', 'autoflexii') and public.is_admin());
create policy "Admins delete car photos" on storage.objects
  for delete to authenticated using (bucket_id in ('car-photos', 'autoflexii') and public.is_admin());

-- 5. Bootstrap the first admin -----------------------------------------
-- Adds the business account if it already exists in Supabase Auth.
-- To add someone else later:
--   insert into public.admin_users (user_id)
--   select id from auth.users where lower(email) = lower('someone@example.com');
insert into public.admin_users (user_id)
select id from auth.users where lower(email) = lower('Autoflexiiii@gmail.com')
on conflict (user_id) do nothing;
