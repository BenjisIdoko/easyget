"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Pill, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/context/cart-context";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/pharmacy", label: "Pharmacy", icon: Pill },
  { href: "/food-market", label: "Food", icon: UtensilsCrossed },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-sm items-center justify-around rounded-full bg-ink p-1.5 shadow-xl shadow-black/25 lg:hidden"
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={href === "/cart" && itemCount > 0 ? `Cart, ${itemCount} items` : label}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-11 items-center gap-1.5 rounded-full px-4 text-xs font-semibold transition ${
              active ? "bg-white text-ink" : "text-white/80"
            }`}
          >
            <Icon className="h-5 w-5" />
            {active && <span>{label}</span>}
            {href === "/cart" && itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[11px] font-bold text-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
