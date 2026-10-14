"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/cart-context";

const links = [
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/food-market", label: "Food Market" },
  { href: "/#consultations", label: "Consultations" },
];

export function Navbar() {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-brand-dark">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-brand text-white">
            EG
          </span>
          EasyGet
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-foreground/80 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-brand">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/cart"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-surface transition hover:border-brand hover:text-brand"
            aria-label="View cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-border md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface px-5 py-4 md:hidden">
          <ul className="flex flex-col gap-4 text-sm font-medium">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
