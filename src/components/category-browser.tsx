"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

export function CategoryBrowser({ products }: { products: Product[] }) {
  const subcategories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.subcategory)))],
    [products]
  );
  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? products : products.filter((p) => p.subcategory === active);

  return (
    <div>
      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0 [&::-webkit-scrollbar]:hidden">
        {subcategories.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            aria-pressed={active === s}
            className={`min-h-11 shrink-0 rounded-full px-4 text-sm font-semibold transition ${
              active === s
                ? "bg-ink text-white"
                : "bg-surface text-muted ring-1 ring-border hover:text-brand"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-10 rounded-3xl bg-surface p-8 text-center text-sm text-muted ring-1 ring-border">
          Nothing here yet — check back soon.
        </p>
      ) : (
        <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
