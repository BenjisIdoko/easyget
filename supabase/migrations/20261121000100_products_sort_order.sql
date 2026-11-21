alter table products add column sort_order integer not null default 0;
create index products_sort_order_idx on products (sort_order);
-- Row order is set by supabase/seed.sql (and later by the admin).
