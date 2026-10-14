"use client";

import Link from "next/link";
import { Plus, ShieldCheck } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatNaira } from "@/lib/format";
import { useCart } from "@/context/cart-context";

const accentByCategory = {
  pharmacy: "bg-pharmacy-light text-pharmacy",
  food: "bg-food-light text-food",
} as const;

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand/5">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="grid h-36 place-items-center bg-brand-light/60 text-5xl">
          {product.imageEmoji}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span
          className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ${accentByCategory[product.category]}`}
        >
          {product.subcategory}
        </span>

        <Link href={`/product/${product.slug}`} className="font-medium leading-snug hover:text-brand">
          {product.name}
        </Link>

        {product.requiresPrescription && (
          <span className="inline-flex w-fit items-center gap-1 text-[11px] font-medium text-amber-700">
            <ShieldCheck className="h-3.5 w-3.5" /> Prescription required
          </span>
        )}

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <p className="font-display text-base font-semibold">
              {formatNaira(product.priceNaira)}
            </p>
            <p className="text-xs text-muted">{product.unit}</p>
          </div>
          <button
            onClick={() => addItem(product.id)}
            className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white transition hover:bg-brand-dark"
            aria-label={`Add ${product.name} to cart`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
