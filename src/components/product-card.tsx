"use client";

import Link from "next/link";
import { useState } from "react";
import { Check, Heart, Plus, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { ProductImage } from "@/components/product-image";
import { useCatalog } from "@/context/catalog-context";
import { IconSwap } from "@/components/icon-swap";

const accentByCategory = {
  pharmacy: "bg-pharmacy-light text-pharmacy",
  food: "bg-food-light text-food-dark",
} as const;

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCart();
  const { show } = useToast();
  const [saved, setSaved] = useState(false);
  const [added, setAdded] = useState(false);
  const { getVendor } = useCatalog();
  const vendor = getVendor(product.vendorId);

  return (
    <div
      className="rise-in group flex flex-col overflow-hidden rounded-3xl bg-surface p-2 shadow-sm shadow-brand/5 ring-1 ring-border/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/10"
      style={{ "--i": Math.min(index, 8) } as React.CSSProperties}
    >
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
          className="absolute right-2 top-2 grid h-11 w-11 place-items-center rounded-full bg-white/90 text-ink shadow-sm press hover:scale-105"
        >
          <IconSwap
            active={saved}
            off={<Heart className="h-4 w-4" />}
            on={<Heart className="h-4 w-4 fill-brand text-brand" />}
          />
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

        {vendor && (
          <p className="truncate text-[11px] text-muted">from {vendor.name}</p>
        )}

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
            onClick={() => {
              addItem(product.id);
              show(`${product.name} added`, { label: "View cart", href: "/cart" });
              setAdded(true);
              setTimeout(() => setAdded(false), 1200);
            }}
            disabled={!product.inStock}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full text-white press disabled:opacity-40 ${added ? "bg-pharmacy" : "bg-ink hover:bg-brand-dark"}`}
            aria-label={`Add ${product.name} to cart`}
          >
            <IconSwap active={added} off={<Plus className="h-5 w-5" />} on={<Check className="h-5 w-5" />} />
          </button>
        </div>
      </div>
    </div>
  );
}
