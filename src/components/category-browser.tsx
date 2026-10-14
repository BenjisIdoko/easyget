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
      <div className="flex flex-wrap gap-2">
        {subcategories.map((s) => (
          <button
            key={s}
            onClick={() => setActive(s)}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              active === s
                ? "border-brand bg-brand text-white"
                : "border-border bg-surface text-muted hover:border-brand hover:text-brand"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
