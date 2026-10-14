# EasyGet — Next.js rebuild

A from-scratch rebuild of the EasyGet pharmacy + food delivery storefront,
replacing the WordPress/Bricks/FluentCart site with a Next.js (App Router)
application you own end to end.

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** for styling, with an EasyGet design system in
  `src/app/globals.css` (fresh layout/visuals, not a clone of the old Bricks
  site — see colors: `--brand` violet, `--pharmacy` teal, `--food` amber)
- **Cart**: React Context + `localStorage` (`src/context/cart-context.tsx`)
- **Payments**: Paystack (redirect/initialize flow — no card data ever
  touches this app's server)
- **Data**: mock catalog in `src/lib/products.ts` today; `supabase/schema.sql`
  defines the real tables to switch to Supabase later with no UI changes

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in at least NEXT_PUBLIC_WHATSAPP_NUMBER
npm run dev
```

Open http://localhost:3000.

## What's wired up vs. stubbed

| Feature | Status |
| --- | --- |
| Browse pharmacy + food market, filter by subcategory | Working, mock data |
| Product detail pages | Working |
| Cart (add/remove/update quantity, persists locally) | Working |
| Checkout form → Paystack | Working once `PAYSTACK_SECRET_KEY` is set |
| Payment verification (`/checkout/success`) | Working once the key is set |
| WhatsApp support / pharmacist / dietary consult links | Working, point at `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| Real product catalog (Supabase) | **Not wired yet** — see below |
| Order persistence (Supabase) | **Not wired yet** — see below |

## Turning on Paystack

1. Get your secret key from the [Paystack dashboard](https://dashboard.paystack.com/#/settings/developer).
2. Set `PAYSTACK_SECRET_KEY` in `.env.local` (and in your host's environment
   variables for production).
3. Set `NEXT_PUBLIC_SITE_URL` to your real domain so Paystack's
   `callback_url` points somewhere reachable.

Until the key is set, checkout shows a clear "payments aren't configured
yet" message instead of silently failing.

## Turning on Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor — it creates `products`,
   `orders`, and `order_items` with RLS enabled (products are publicly
   readable; orders are server-only via the service role key).
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in
   `.env.local`. `src/lib/supabase.ts` picks these up automatically.
4. Replace the calls to `src/lib/products.ts` (`getProductsByCategory`,
   `getProductBySlug`) with Supabase queries, and swap `/api/checkout` to
   insert into `orders`/`order_items` using `SUPABASE_SERVICE_ROLE_KEY`
   instead of only calling Paystack.

This split was deliberate: the UI, cart, and checkout flow all work today
against mock data, so swapping in a real backend is a data-layer change,
not a rewrite.

## Design notes

This is a fresh redesign, not a recreation of the Bricks site — new layout,
new type system (Sora + Plus Jakarta Sans), new component patterns. The
EasyGet name and a violet brand color are kept for continuity; everything
else was redrawn. Pharmacy and Food Market get their own accent colors
(teal / amber) throughout so the two halves of the business stay visually
distinct inside one storefront.

Product imagery is emoji placeholders (`imageEmoji` in
`src/lib/products.ts`) — swap in real photography by adding an `imageUrl`
field and a `next/image` call in `ProductCard` / the product page once you
have photos.
