# EasyGet UI Revamp — Design

Date: 2026-11-13 · Status: awaiting approval

## Intent and why
The current storefront looks flat, boring and uninspiring (owner's words). EasyGet
(pharmacy + food market + grocery concierge + catering) should feel like a modern
food-delivery app: captivating, appetizing, energetic — while pharmacy still reads
as trustworthy. This is a visual/UX redesign only.

## Goals
- Mobile-first redesign that follows the *flow* of reference A (dark green app):
  location bar + cart → greeting + search → promo banner → category pills
  (All / Pharmacy / Food) → product grid → floating bottom nav; product page with
  large image, quantity stepper and sticky "Add to Cart" bar.
- Apply the *look* of reference B (light "Fresh Lime"): soft lime-to-white
  background wash, lime accent, black pill buttons and nav, pastel photo backdrops.
- Real food/pharmacy photography (free stock) instead of emoji.
- Desktop: same layout widens into a grid; bottom nav becomes a top bar.
- All existing pages restyled consistently: home, pharmacy, food-market, product,
  cart, checkout, checkout/success, grocery-concierge, catering.

## Non-goals
- No change to cart logic, checkout/Paystack API routes, Supabase schema, routes,
  or the data model beyond one added image field.
- No new features (accounts, favorites, search backend, map). Search/favorite/location
  UI is visual only unless trivially wired to existing data (client-side filter OK).
- No dark mode.

## Anti-goals (failure even if it "works")
- Looking like a food-only burger app: pharmacy must stay clear and credible.
- Stock photos implying a specific branded medicine is shown.
- Functional text below 11px, low-contrast text, or desktop looking like a stretched phone.

## Constraints
- Existing Next.js 16 app (App Router, Tailwind v4, Turbopack); read
  `node_modules/next/dist/docs/` before using Next APIs (AGENTS.md).
- Checkout, cart context and API routes must keep working unchanged.
- Paystack not configured now; the no-key states must still look designed.
- Images are for the testing phase only.

## Approaches considered
1. **Restyle in place — chosen.** Keep app and logic; replace tokens, components,
   pages. Fastest, lowest risk.
2. Phone-app shell on all screens — rejected: wastes desktop space, cramps long forms.
3. Fresh rebuild — rejected: slow, risks checkout, nothing in the logic needs replacing.

## Decisions (owner)
- Direction: A's flow + B's look. Approach 1. Link to free Unsplash photos by URL
  (not saved in repo) during testing; swap for owner's photos later.

## Builder's calls (owner may override)
- Tokens: lime accent (~#a3e635 on near-black text), black (#111) pill buttons/nav,
  light background wash; food uses lime; pharmacy keeps a small teal tint (chips,
  badges, prescription label) so it reads clinical. Violet brand is retired.
- Fonts: keep Sora (display) + Plus Jakarta Sans (body); load them properly via
  `next/font` (also clears the current lint warning).
- `Product` gets optional `imageUrl`; `ProductCard`/product page use `next/image`
  with `images.remotePatterns` for the Unsplash host; emoji stays as fallback.
- Photos: generic shots per subcategory (not branded product); photographer
  credit kept in a data comment; one URL per product in `products.ts`.
- Bottom nav (Home, Pharmacy/Food browse, Cart with count, WhatsApp) on mobile;
  top bar from `md` up. Promo banner copy is placeholder.
- Category pills filter client-side on the home/browse views.
- Min functional text 11px; verify contrast on lime and teal chips.

## Left to the builder
Exact spacing/radius scale, component split, icon choice (lucide), skeleton/loading
states, empty-cart design, page-by-page copy tweaks, and checking at 375px and 1280px.

## Verification
Typecheck, lint, `next build` clean; manual pass of every route at mobile and
desktop widths; cart add/update/remove and COD-to-WhatsApp checkout still work;
Paystack-not-configured states render properly.
