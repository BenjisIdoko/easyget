"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";

const backdrop = {
  pharmacy: "bg-pharmacy-light",
  food: "bg-food-light",
} as const;

/** Photo (or emoji fallback) on a pastel backdrop. Fills its `relative` parent. */
export function ProductImage({
  product,
  className = "",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  preload = false,
}: {
  product: Product;
  className?: string;
  sizes?: string;
  preload?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(product.imageUrl) && !failed;

  return (
    <div className={`absolute inset-0 overflow-hidden ${backdrop[product.category]} ${className}`}>
      {showPhoto ? (
        <Image
          src={product.imageUrl!}
          alt={product.name}
          fill
          preload={preload}
          sizes={sizes}
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="grid h-full w-full place-items-center text-6xl" aria-hidden>
          {product.imageEmoji}
        </div>
      )}
    </div>
  );
}
