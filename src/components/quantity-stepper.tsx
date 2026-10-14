"use client";

import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  quantity,
  onChange,
}: {
  quantity: number;
  onChange: (next: number) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
      <button
        onClick={() => onChange(quantity - 1)}
        className="grid h-7 w-7 place-items-center rounded-full text-muted transition hover:bg-brand-light hover:text-brand"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-5 text-center text-sm font-medium">{quantity}</span>
      <button
        onClick={() => onChange(quantity + 1)}
        className="grid h-7 w-7 place-items-center rounded-full text-muted transition hover:bg-brand-light hover:text-brand"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
