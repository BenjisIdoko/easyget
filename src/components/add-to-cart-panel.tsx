"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatNaira } from "@/lib/format";
import { QuantityStepper } from "@/components/quantity-stepper";

export function AddToCartPanel({
  productId,
  priceNaira,
}: {
  productId: string;
  priceNaira: number;
}) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <QuantityStepper quantity={quantity} onChange={(n) => setQuantity(Math.max(1, n))} />
      <button
        onClick={() => {
          addItem(productId, quantity);
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="flex h-14 flex-1 items-center justify-between rounded-full bg-ink pl-6 pr-2 text-sm font-semibold text-white transition hover:bg-brand-dark"
      >
        <span className="whitespace-nowrap">
          {added ? (
            "Added"
          ) : (
            <>
              <span className="min-[420px]:hidden">Add</span>
              <span className="hidden min-[420px]:inline">Add to cart</span> · {formatNaira(priceNaira * quantity)}
            </>
          )}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand">
          {added ? <Check className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
        </span>
      </button>
    </div>
  );
}
