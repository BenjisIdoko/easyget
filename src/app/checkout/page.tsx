"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Banknote, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { products } from "@/lib/products";
import { formatNaira } from "@/lib/format";
import { LAST_ORDER_KEY, type OrderSummary } from "@/lib/orders";

export default function CheckoutPage() {
  const { lines, subtotalNaira } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (error) errorRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [error]);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    notes: "",
  });

  const items = lines
    .map((line) => ({ line, product: products.find((p) => p.id === line.productId) }))
    .filter((x) => x.product);

  if (items.length === 0) {
    return (
      <section className="container-page flex flex-col items-center py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">Nothing to check out</h1>
        <p className="mt-2 text-sm text-muted">Add items to your cart first.</p>
        <Link href="/pharmacy" className="pill-btn mt-6">
          Browse the pharmacy
        </Link>
      </section>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
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

      const order = data as OrderSummary;
      window.sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
      router.push(`/checkout/success?ref=${order.reference}`);
    } catch {
      setError("Could not place your order. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <section className="container-page grid gap-8 py-8 lg:grid-cols-3 lg:gap-10 lg:py-12">
      <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-2">
        <h1 className="font-display text-2xl font-semibold">Checkout</h1>

        {error && (
          <p ref={errorRef} role="alert" className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <input
              required
              autoComplete="name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Phone number">
            <input
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="input"
            />
          </Field>
        </div>

        <Field label="Delivery address">
          <textarea
            required
            rows={3}
            autoComplete="street-address"
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

        <div className="flex items-start gap-3 rounded-2xl bg-pharmacy-light px-4 py-3 text-sm text-pharmacy">
          <Banknote className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
          <p>
            <span className="font-semibold">Pay on delivery.</span> Nothing to
            pay now. Pay the rider in cash or by transfer when your order
            arrives.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="pill-btn h-14 w-full"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Placing order…
            </>
          ) : (
            `Place order · ${formatNaira(subtotalNaira)}`
          )}
        </button>
      </form>

      <div className="h-fit rounded-3xl bg-surface p-6 ring-1 ring-border/70">
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
        <p className="mt-2 text-xs text-muted">
          Delivery fee is confirmed by our team and paid with your order.
        </p>
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
