"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/cart-context";

const links = [
  { href: "/pharmacy", label: "Pharmacy" },
  { href: "/food-market", label: "Food Market" },
  { href: "/grocery-concierge", label: "Grocery Concierge" },
  { href: "/catering", label: "Catering" },
  { href: "/#consultations", label: "Consultations" },
];

export function Navbar() {
  const { itemCount } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md lg:border-b lg:border-border/80">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-brand-dark">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand text-sm text-white">
            EG
          </span>
          EasyGet
        </Link>

        <span className="inline-flex items-center gap-1 rounded-full bg-surface px-3 py-1.5 text-xs font-medium text-muted shadow-sm lg:hidden">
          <MapPin className="h-3.5 w-3.5 text-brand" /> Lagos
        </span>

        <nav className="hidden items-center gap-1 text-sm font-medium lg:flex">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-full px-3.5 py-2 transition ${
                  active ? "bg-brand-light text-brand-dark" : "text-foreground/80 hover:text-brand"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/cart"
          className="relative grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition hover:bg-brand-dark"
          aria-label={itemCount > 0 ? `View cart, ${itemCount} items` : "View cart"}
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-semibold text-white ring-2 ring-background">
              {itemCount > 9 ? "9+" : itemCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
