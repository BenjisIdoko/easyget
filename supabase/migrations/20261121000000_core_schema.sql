-- EasyGet core schema: vendors, catalog, orders split per vendor, admin access.
-- Food products belong to a vendor (shown as "from <vendor>"); pharmacy
-- products have no vendor. One customer order is split into one group per
-- vendor (pharmacy items form their own group), each with its own status.

create extension if not exists "pgcrypto";

create type product_category as enum ('pharmacy', 'food');
create type order_status as enum ('new', 'confirmed', 'out_for_delivery', 'delivered', 'cancelled');
create type group_status as enum ('pending', 'confirmed', 'ready', 'picked_up', 'cancelled');
create type payment_status as enum ('unpaid', 'paid');

-- ---------------------------------------------------------------- admin ---
-- Staff who can manage everything. Rows reference Supabase Auth users.
create table admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table admin_users enable row level security;

-- Kept in a non-exposed schema so it is not callable through the public API.
create schema private;
grant usage on schema private to authenticated;

create function private.is_admin()
returns boolean
language sql
security definer
set search_path = ''
stable
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated;

create function private.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create policy "Admins can read admin list" on admin_users
  for select to authenticated using ((select private.is_admin()));

-- -------------------------------------------------------------- catalog ---
create table vendors (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category product_category not null,
  vendor_id uuid references vendors (id),
  subcategory text not null,
  price_naira integer not null check (price_naira >= 0),
  compare_at_naira integer check (compare_at_naira is null or compare_at_naira >= 0),
  description text not null default '',
  requires_prescription boolean not null default false,
  unit text not null default 'per serving',
  image_url text,
  image_emoji text not null default '🍽️',
  tags text[] not null default '{}',
  in_stock boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Food always shows its vendor; pharmacy never does.
  constraint products_vendor_matches_category check (
    (category = 'food' and vendor_id is not null)
    or (category = 'pharmacy' and vendor_id is null)
  )
);
create index products_category_idx on products (category);
create index products_vendor_id_idx on products (vendor_id);
create trigger products_touch_updated_at
  before update on products
  for each row execute function private.touch_updated_at();

-- --------------------------------------------------------------- orders ---
create table orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  full_name text not null,
  phone text not null,
  email text,
  address text not null,
  notes text,
  total_naira integer not null check (total_naira >= 0),
  delivery_fee_naira integer not null default 0 check (delivery_fee_naira >= 0),
  payment_method text not null default 'pay_on_delivery',
  payment_status payment_status not null default 'unpaid',
  status order_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_status_idx on orders (status);
create index orders_created_at_idx on orders (created_at desc);
create trigger orders_touch_updated_at
  before update on orders
  for each row execute function private.touch_updated_at();

-- One group per vendor within an order; vendor_id is null for pharmacy items.
create table order_groups (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  vendor_id uuid references vendors (id),
  label text not null,
  subtotal_naira integer not null check (subtotal_naira >= 0),
  status group_status not null default 'pending',
  created_at timestamptz not null default now()
);
create index order_groups_order_id_idx on order_groups (order_id);
create index order_groups_vendor_id_idx on order_groups (vendor_id);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  group_id uuid not null references order_groups (id) on delete cascade,
  product_id uuid references products (id) on delete set null,
  name text not null,
  quantity integer not null check (quantity > 0),
  unit_price_naira integer not null check (unit_price_naira >= 0),
  requires_prescription boolean not null default false,
  -- A pharmacist ticks this once the prescription has been checked.
  prescription_checked boolean not null default false
);
create index order_items_order_id_idx on order_items (order_id);
create index order_items_group_id_idx on order_items (group_id);
create index order_items_product_id_idx on order_items (product_id);

-- ------------------------------------------------- other customer forms ---
create table concierge_requests (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  full_name text not null,
  phone text not null,
  email text,
  address text not null,
  preferred_store text,
  shopping_list text[] not null,
  budget_naira integer not null check (budget_naira >= 0),
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table catering_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  event_date date not null,
  guest_count integer not null check (guest_count > 0),
  menu_notes text not null,
  budget_range_naira integer,
  created_at timestamptz not null default now()
);

-- ------------------------------------------------------------------ RLS ---
alter table vendors enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table order_groups enable row level security;
alter table order_items enable row level security;
alter table concierge_requests enable row level security;
alter table catering_requests enable row level security;

-- Shoppers can read the live catalog.
create policy "Public can read active vendors" on vendors
  for select to anon, authenticated using (is_active);
create policy "Public can read in-stock products" on products
  for select to anon, authenticated using (in_stock);

-- Admins can do everything. Orders, groups, items and the request tables are
-- otherwise server-only: customers' orders are written by the app's server
-- using the service role key, which bypasses RLS.
create policy "Admins manage vendors" on vendors
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins manage products" on products
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins manage orders" on orders
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins manage order groups" on order_groups
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins manage order items" on order_items
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins manage concierge requests" on concierge_requests
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admins manage catering requests" on catering_requests
  for all to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));

-- -------------------------------------------------------------- storage ---
-- Product photos: anyone can view, only admins can upload or change them.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Admins manage product images" on storage.objects
  for all to authenticated
  using (bucket_id = 'product-images' and (select private.is_admin()))
  with check (bucket_id = 'product-images' and (select private.is_admin()));
