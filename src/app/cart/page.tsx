"use client";

import Link from "next/link";
import { ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { products } from "@/lib/products";
import { formatNaira } from "@/lib/format";
import { QuantityStepper } from "@/components/quantity-stepper";
import { ProductImage } from "@/components/product-image";

export default function CartPage() {
  const { lines, setQuantity, removeItem, subtotalNaira } = useCart();

  const items = lines
    .map((line) => ({
      line,
      product: products.find((p) => p.id === line.productId),
    }))
    .filter((x) => x.product);

  if (items.length === 0) {
    return (
      <section className="container-page flex flex-col items-center py-16 text-center">
        <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-light text-brand">
          <ShoppingBag className="h-9 w-9" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted">
          Browse the pharmacy or food market to add something.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/pharmacy" className="pill-btn">
            Pharmacy
          </Link>
          <Link
            href="/food-market"
            className="inline-flex min-h-11 items-center rounded-full bg-surface px-6 text-sm font-semibold ring-1 ring-border"
          >
            Food Market
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page grid gap-8 py-6 lg:grid-cols-3 lg:gap-10 lg:py-12">
      <div className="lg:col-span-2">
        <h1 className="font-display text-2xl font-semibold">My cart</h1>

        <ul className="mt-5 space-y-3">
          {items.map(({ line, product }) => (
            <li
              key={line.productId}
              className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-3xl bg-surface p-3 ring-1 ring-border/70"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl">
                <ProductImage product={product!} sizes="80px" />
              </div>
              <div className="min-w-0 flex-1 basis-40">
                <p className="line-clamp-2 text-sm font-semibold">{product!.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {formatNaira(product!.priceNaira)} / {product!.unit}
                </p>
                <p className="mt-1 font-display text-base font-semibold">
                  {formatNaira(product!.priceNaira * line.quantity)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <QuantityStepper
                  quantity={line.quantity}
                  onChange={(n) => setQuantity(line.productId, n)}
                />
                <button
                  onClick={() => removeItem(line.productId)}
                  className="grid h-11 w-11 place-items-center rounded-full text-muted transition hover:bg-red-50 hover:text-danger"
                  aria-label={`Remove ${product!.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-fit rounded-3xl bg-surface p-6 ring-1 ring-border/70">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-semibold">{formatNaira(subtotalNaira)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-muted">Delivery</span>
          <span className="font-medium">Calculated at checkout</span>
        </div>
        <Link href="/checkout" className="pill-btn mt-6 h-14 w-full">
          Proceed to checkout
        </Link>
      </div>
    </section>
  );
}
