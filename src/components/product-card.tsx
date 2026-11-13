"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Plus, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/context/cart-context";
import { ProductImage } from "@/components/product-image";

const accentByCategory = {
  pharmacy: "bg-pharmacy-light text-pharmacy",
  food: "bg-food-light text-food-dark",
} as const;

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [saved, setSaved] = useState(false);

  return (
    <div className="group flex flex-col overflow-hidden rounded-3xl bg-surface p-2 shadow-sm shadow-brand/5 ring-1 ring-border/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/10">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
        <Link href={`/product/${product.slug}`} className="absolute inset-0" tabIndex={-1} aria-hidden>
          <ProductImage
            product={product}
            className={product.inStock ? "" : "opacity-50 grayscale"}
          />
        </Link>
        <button
          onClick={() => setSaved((v) => !v)}
          aria-label={saved ? "Remove from saved" : "Save"}
          aria-pressed={saved}
          className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition hover:scale-105"
        >
          <Heart className={`h-4 w-4 ${saved ? "fill-brand text-brand" : ""}`} />
        </button>
        {!product.inStock && (
          <span className="absolute bottom-2 left-2 rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-white">
            Out of stock
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <span
          className={`w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${accentByCategory[product.category]}`}
        >
          {product.subcategory}
        </span>

        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold leading-snug hover:text-brand"
        >
          {product.name}
        </Link>

        {product.requiresPrescription && (
          <span className="inline-flex w-fit items-center gap-1 text-[11px] font-semibold text-amber-800">
            <ShieldCheck className="h-3.5 w-3.5" /> Prescription required
          </span>
        )}

        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="min-w-0">
            <p className="font-display text-base font-semibold">
              {formatNaira(product.priceNaira)}
            </p>
            <p className="truncate text-[11px] text-muted">{product.unit}</p>
          </div>
          <button
            onClick={() => addItem(product.id)}
            disabled={!product.inStock}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-white transition hover:bg-brand-dark disabled:opacity-40"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
