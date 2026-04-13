-- Fixora MVP schema + RLS

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  role text not null check (role in ('owner', 'pro')),
  created_at timestamptz not null default now()
);

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text not null,
  vehicle_brand text not null,
  vehicle_model text not null,
  city text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  pro_id uuid not null references public.profiles (id) on delete cascade,
  price numeric(10,2) not null check (price > 0),
  message text not null,
  created_at timestamptz not null default now(),
  constraint unique_offer_per_pro_per_listing unique (listing_id, pro_id)
);

-- Auto-create profile at signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'role', 'owner')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.listings enable row level security;
alter table public.offers enable row level security;

-- Profiles policies
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

-- Listings policies
create policy "Authenticated users can read open listings"
on public.listings for select
to authenticated
using (
  status = 'open'
  or owner_id = auth.uid()
);

create policy "Owners can create their own listings"
on public.listings for insert
to authenticated
with check (
  owner_id = auth.uid()
  and exists (
    select 1
    from public.profiles p
    where p.id = auth.uid() and p.role = 'owner'
  )
);

create policy "Owners can update their own listings"
on public.listings for update
to authenticated
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

-- Offers policies
create policy "Pros can create offers on open listings"
on public.offers for insert
to authenticated
with check (
  pro_id = auth.uid()
  and exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'pro'
  )
  and exists (
    select 1 from public.listings l
    where l.id = listing_id and l.status = 'open'
  )
);

create policy "Pros can read their own offers"
on public.offers for select
to authenticated
using (pro_id = auth.uid());

create policy "Owners can read offers on their listings"
on public.offers for select
to authenticated
using (
  exists (
    select 1
    from public.listings l
    where l.id = offers.listing_id
      and l.owner_id = auth.uid()
  )
);
