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
    <div className="flex items-center gap-1 rounded-full bg-surface p-1 ring-1 ring-border">
      <button
        onClick={() => onChange(quantity - 1)}
        className="grid h-11 w-11 place-items-center rounded-full text-ink transition hover:bg-brand-light hover:text-brand"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-6 text-center text-sm font-semibold" aria-live="polite">
        {quantity}
      </span>
      <button
        onClick={() => onChange(quantity + 1)}
        className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition hover:bg-brand-dark"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
