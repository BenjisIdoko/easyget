"use client";

import { useState } from "react";
import { formatNaira } from "@/lib/format";

const MIN_BUDGET_NAIRA = 2000;

export default function GroceryConciergePage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    preferredStore: "",
    shoppingList: "",
    budgetNaira: "",
    notes: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const shoppingList = form.shoppingList
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
    const budgetNaira = Number(form.budgetNaira);

    if (shoppingList.length === 0) {
      setError("Add at least one item to your shopping list.");
      return;
    }
    if (!Number.isFinite(budgetNaira) || budgetNaira < MIN_BUDGET_NAIRA) {
      setError(`Budget must be at least ${formatNaira(MIN_BUDGET_NAIRA)}.`);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/concierge/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            fullName: form.fullName,
            phone: form.phone,
            email: form.email,
            address: form.address,
            notes: form.notes,
          },
          shoppingList,
          budgetNaira,
          preferredStore: form.preferredStore,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }

      window.location.href = data.authorizationUrl;
    } catch {
      setError("Could not reach the payment service. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <section className="container-page grid gap-8 py-8 lg:grid-cols-3 lg:gap-10 lg:py-12">
      <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-2">
        <div>
          <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
            Budget + List
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold">Grocery Concierge</h1>
          <p className="mt-2 text-sm text-muted">
            Give us a list and a budget — we shop it at your preferred
            supermarket and deliver with the official till receipt. Spent
            less than your budget? We refund the difference. Spent a little
            more? You settle it on delivery.
          </p>
        </div>

        {error && (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-danger">{error}</p>
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

        <Field label="Email">
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Delivery address">
          <textarea
            required
            rows={2}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Preferred supermarket (optional)">
          <input
            placeholder="e.g. Labeira Supermarket — leave blank for our pick"
            value={form.preferredStore}
            onChange={(e) => setForm({ ...form, preferredStore: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Shopping list — one item per line">
          <textarea
            required
            rows={6}
            placeholder={"2 bags rice\n1 carton eggs\nTomato paste x3"}
            value={form.shoppingList}
            onChange={(e) => setForm({ ...form, shoppingList: e.target.value })}
            className="input"
          />
        </Field>

        <Field label={`Budget (minimum ${formatNaira(MIN_BUDGET_NAIRA)})`}>
          <input
            required
            type="number"
            min={MIN_BUDGET_NAIRA}
            step={100}
            value={form.budgetNaira}
            onChange={(e) => setForm({ ...form, budgetNaira: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Notes for your shopper (optional)">
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
          className="pill-btn h-14 w-full"
        >
          {submitting ? "Redirecting to Paystack…" : "Pay deposit with Paystack"}
        </button>
      </form>

      <aside className="h-fit rounded-3xl bg-surface p-6 ring-1 ring-border/70">
        <h2 className="font-display text-lg font-semibold">How it works</h2>
        <ol className="mt-4 space-y-3 text-sm text-muted">
          <li>1. Send your list and set a budget.</li>
          <li>2. Pay a deposit equal to that budget — this funds the shop.</li>
          <li>3. Our shopper buys your items and keeps the till receipt.</li>
          <li>
            4. We deliver with the receipt and settle up: refund any
            underspend, or collect a small top-up for any overspend.
          </li>
        </ol>
      </aside>
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
