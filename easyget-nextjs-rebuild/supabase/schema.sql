-- EasyGet rebuild — Supabase schema
-- Run this in the Supabase SQL editor once a project is provisioned.
-- Matches the shapes in src/lib/types.ts; the app currently runs on
-- src/lib/products.ts mock data and can be pointed at these tables once
-- NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are set.

create extension if not exists "pgcrypto";

create type product_category as enum ('pharmacy', 'food');
create type order_status as enum ('pending', 'paid', 'fulfilled', 'cancelled');

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category product_category not null,
  subcategory text not null,
  price_naira integer not null check (price_naira >= 0),
  compare_at_naira integer,
  description text not null default '',
  requires_prescription boolean not null default false,
  unit text not null default '1 unit',
  image_url text,
  tags text[] not null default '{}',
  in_stock boolean not null default true,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  full_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  notes text,
  total_naira integer not null check (total_naira >= 0),
  status order_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders (id) on delete cascade,
  product_id uuid not null references products (id),
  quantity integer not null check (quantity > 0),
  unit_price_naira integer not null check (unit_price_naira >= 0)
);

create index order_items_order_id_idx on order_items (order_id);
create index products_category_idx on products (category);

-- Row Level Security: products are publicly readable; orders/order_items
-- are written only via the server (service role key), never the anon key.
alter table products enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

create policy "Public can read in-stock products"
  on products for select
  using (in_stock = true);

-- No insert/update/delete policies for anon on orders/order_items — those
-- tables are only ever touched from the /api/checkout route handler using
-- SUPABASE_SERVICE_ROLE_KEY (server-only, never exposed to the browser).
