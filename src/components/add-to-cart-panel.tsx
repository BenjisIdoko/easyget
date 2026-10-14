"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { QuantityStepper } from "@/components/quantity-stepper";

export function AddToCartPanel({ productId }: { productId: string }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex items-center gap-4">
      <QuantityStepper quantity={quantity} onChange={(n) => setQuantity(Math.max(1, n))} />
      <button
        onClick={() => {
          addItem(productId, quantity);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="flex-1 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        {added ? "Added to cart ✓" : "Add to cart"}
      </button>
    </div>
  );
}
