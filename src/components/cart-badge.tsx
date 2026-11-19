"use client";

import { useCart } from "@/context/cart-context";

/** Count bubble that pops in each time the count changes. */
export function CartBadge({ className }: { className: string }) {
  const { itemCount } = useCart();
  if (itemCount === 0) return null;
  return (
    <span key={itemCount} aria-hidden className={`pop-in ${className}`}>
      {itemCount > 9 ? "9+" : itemCount}
    </span>
  );
}
