"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

type Filter = "all" | Product["category"];

const pills: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "food", label: "Food" },
];

export function HomeBrowser({
  products,
  children,
}: {
  products: Product[];
  /** Rendered between the search/pills and the grid (promo banner). */
  children?: React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (filter !== "all" && p.category !== filter) return false;
      if (!q) return true;
      return [p.name, p.subcategory, ...p.tags].some((t) => t.toLowerCase().includes(q));
    });
  }, [products, query, filter]);

  return (
    <div>
      <label className="flex min-h-12 items-center gap-2 rounded-full bg-surface px-4 shadow-sm shadow-brand/10 ring-1 ring-border focus-within:ring-2 focus-within:ring-brand/40">
        <Search className="h-5 w-5 text-muted" aria-hidden />
        <span className="sr-only">Search food and medicine</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search food, medicine…"
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
      </label>

      {children}

      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold">Popular near you</h2>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {pills.map((p) => (
          <button
            key={p.value}
            onClick={() => setFilter(p.value)}
            aria-pressed={filter === p.value}
            className={`min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition ${
              filter === p.value
                ? "bg-ink text-white"
                : "bg-surface text-muted ring-1 ring-border hover:text-brand"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-3xl bg-surface p-8 text-center text-sm text-muted ring-1 ring-border">
          No matches for “{query}”. Try another word, or ask us on WhatsApp.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
