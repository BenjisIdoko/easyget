"use client";

import { useState } from "react";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

export default function CateringPage() {
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    eventDate: "",
    guestCount: "",
    menuNotes: "",
    budgetRangeNaira: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (
      !form.fullName ||
      !form.phone ||
      !form.eventDate ||
      !form.guestCount ||
      !form.menuNotes
    ) {
      setError(
        "Please fill in your name, phone, event date, guest count and what you need."
      );
      return;
    }
    setError(null);

    const lines = [
      "Hi EasyGet, I'd like a quote for an event:",
      `Name: ${form.fullName}`,
      `Phone: ${form.phone}`,
      `Event date: ${form.eventDate}`,
      `Guests: ${form.guestCount}`,
      `Menu / items wanted: ${form.menuNotes}`,
      form.budgetRangeNaira ? `Budget: ₦${form.budgetRangeNaira}` : null,
    ].filter(Boolean);

    const message = encodeURIComponent(lines.join("\n"));
    window.location.href = `https://wa.me/${whatsapp}?text=${message}`;
  }

  return (
    <section className="container-page grid gap-8 py-8 lg:grid-cols-3 lg:gap-10 lg:py-12">
      <form onSubmit={handleSubmit} className="space-y-5 lg:col-span-2">
        <div>
          <span className="inline-flex items-center rounded-full bg-brand-light px-3 py-1 text-xs font-semibold text-brand-dark">
            Bulk & Event Catering
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold">Catering & Events</h1>
          <p className="mt-2 text-sm text-muted">
            Barrels of soup, party jollof, drinks — for gatherings of any
            size. Tell us what you need and we&apos;ll send a custom quote
            on WhatsApp.
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

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Event date">
            <input
              required
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              className="input"
            />
          </Field>
          <Field label="Number of guests">
            <input
              required
              type="number"
              min={1}
              value={form.guestCount}
              onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
              className="input"
            />
          </Field>
        </div>

        <Field label="What do you need? (dishes, drinks, quantities)">
          <textarea
            required
            rows={5}
            placeholder="e.g. 2 barrels party jollof, 1 barrel pepper soup, drinks for 80 people"
            value={form.menuNotes}
            onChange={(e) => setForm({ ...form, menuNotes: e.target.value })}
            className="input"
          />
        </Field>

        <Field label="Budget range (optional, ₦)">
          <input
            type="number"
            min={0}
            value={form.budgetRangeNaira}
            onChange={(e) => setForm({ ...form, budgetRangeNaira: e.target.value })}
            className="input"
          />
        </Field>

        <button
          type="submit"
          className="pill-btn h-14 w-full"
        >
          Get a quote on WhatsApp
        </button>
      </form>

      <aside className="h-fit rounded-3xl bg-surface p-6 ring-1 ring-border/70">
        <h2 className="font-display text-lg font-semibold">How it works</h2>
        <ol className="mt-4 space-y-3 text-sm text-muted">
          <li>1. Tell us the event, headcount and what you want served.</li>
          <li>2. We reply on WhatsApp with a firm price, usually same day.</li>
          <li>
            3. Confirm with a deposit, and we handle the rest — cooking,
            packing and delivery on the day.
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
