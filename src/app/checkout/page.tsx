"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { products } from "@/lib/products";
import { formatNaira } from "@/lib/format";

export default function CheckoutPage() {
  const { lines, subtotalNaira } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  });

  const items = lines
    .map((line) => ({ line, product: products.find((p) => p.id === line.productId) }))
    .filter((x) => x.product);

  if (items.length === 0) {
    return (
      <section className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Nothing to check out</h1>
        <p className="mt-2 text-sm text-muted">Add items to your cart first.</p>
      </section>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, customer: form }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      const params = new URLSearchParams({
        reference: data.reference,
        wa: data.whatsappUrl,
      });
      window.location.href = `/checkout/success?${params.toString()}`;
    } catch {
      setError("Could not place your order. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <section className="container-page grid gap-10 py-12 lg:grid-cols-3">
      <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-2">
        <h1 className="font-display text-2xl font-semibold">Checkout</h1>

        {error && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-danger">{error}</p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Phone number">
            <input
              required
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input"
            />
          </Field>
        </div>

        <Field label="Email (optional)">
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Delivery address">
          <textarea
            required
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Notes for the rider or pharmacist (optional)">
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="input"
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-dark disabled:opacity-60"
        >
          {submitting ? "Placing order…" : `Place order · ${formatNaira(subtotalNaira)}`}
        </button>
        <p className="text-center text-xs text-muted">
          Pay cash on delivery. We&apos;ll confirm your order on WhatsApp.
        </p>
      </form>

      <div className="h-fit rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {items.map(({ line, product }) => (
            <li key={line.productId} className="flex justify-between">
              <span className="text-muted">
                {product!.name} × {line.quantity}
              </span>
              <span className="font-medium">
                {formatNaira(product!.priceNaira * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-border pt-4 font-semibold">
          <span>Total</span>
          <span>{formatNaira(subtotalNaira)}</span>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
