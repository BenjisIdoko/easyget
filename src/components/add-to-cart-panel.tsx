"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/context/toast-context";
import { formatNaira } from "@/lib/format";
import { IconSwap } from "@/components/icon-swap";
import { QuantityStepper } from "@/components/ui/quantity-stepper";

export function AddToCartPanel({
  productId,
  name,
  priceNaira,
}: {
  productId: string;
  name: string;
  priceNaira: number;
}) {
  const { addItem } = useCart();
  const { show } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <div className="flex items-center gap-3">
      <QuantityStepper value={quantity} onValueChange={setQuantity} min={1} />
      <button
        onClick={() => {
          addItem(productId, quantity);
          show(`${quantity > 1 ? `${quantity} × ` : ""}${name} added`, { label: "View cart", href: "/cart" });
          setAdded(true);
          setTimeout(() => setAdded(false), 1500);
        }}
        className="flex h-14 flex-1 items-center justify-between rounded-full bg-ink pl-6 pr-2 text-sm font-semibold text-white press hover:bg-brand-dark"
      >
        <span className="whitespace-nowrap">
          {added ? (
            "Added"
          ) : (
            <>
              <span className="min-[460px]:hidden">Add</span>
              <span className="hidden min-[460px]:inline">Add to cart</span> · {formatNaira(priceNaira * quantity)}
            </>
          )}
        </span>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-brand">
          <IconSwap active={added} off={<ArrowRight className="h-5 w-5" />} on={<Check className="h-5 w-5" />} />
        </span>
      </button>
    </div>
  );
}
