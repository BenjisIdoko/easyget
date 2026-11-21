import { cacheLife, cacheTag } from "next/cache";
import { isSupabaseConfigured, supabase } from "./supabase";
import { products as mockProducts } from "./products";
import { vendors as mockVendors } from "./menus";
import type { Product, Vendor } from "./types";

export interface Catalog {
  products: Product[];
  vendors: Vendor[];
}

/**
 * Reads the live catalog from Supabase (anon key; row-level security only
 * exposes active vendors and in-stock products). With no Supabase configured
 * (e.g. a fresh clone without .env.local) it falls back to the built-in menu
 * data. A configured-but-failing database throws instead of silently showing
 * stale prices.
 *
 * Use this where prices decide money (the orders API). For pages, use
 * getCatalog(), which caches it.
 */
export async function fetchCatalog(): Promise<Catalog> {
  if (!supabase || !isSupabaseConfigured) {
    return { products: mockProducts, vendors: mockVendors };
  }

  const [vendorRes, productRes] = await Promise.all([
    supabase.from("vendors").select("id, name").order("name"),
    supabase
      .from("products")
      .select(
        "id, slug, name, category, vendor_id, subcategory, price_naira, compare_at_naira, description, requires_prescription, unit, image_url, image_emoji, tags, in_stock"
      )
      .order("sort_order"),
  ]);

  if (vendorRes.error) throw new Error(`Could not load vendors: ${vendorRes.error.message}`);
  if (productRes.error) throw new Error(`Could not load products: ${productRes.error.message}`);

  return {
    vendors: vendorRes.data,
    products: productRes.data.map(
      (r): Product => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        category: r.category,
        vendorId: r.vendor_id ?? undefined,
        subcategory: r.subcategory,
        priceNaira: r.price_naira,
        compareAtNaira: r.compare_at_naira ?? undefined,
        description: r.description,
        requiresPrescription: r.requires_prescription,
        unit: r.unit,
        imageEmoji: r.image_emoji,
        imageUrl: r.image_url ?? undefined,
        tags: r.tags,
        inStock: r.in_stock,
      })
    ),
  };
}

/** Cached for pages. Tagged "catalog" so admin edits can revalidate it. */
export async function getCatalog(): Promise<Catalog> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");
  return fetchCatalog();
}
