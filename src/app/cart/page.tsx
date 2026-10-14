"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { products } from "@/lib/products";
import { formatNaira } from "@/lib/format";
import { QuantityStepper } from "@/components/quantity-stepper";

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
      <section className="container-page py-20 text-center">
        <h1 className="font-display text-2xl font-semibold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-muted">
          Browse the pharmacy or food market to add something.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/pharmacy" className="rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white">
            Pharmacy
          </Link>
          <Link href="/food-market" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
            Food Market
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="container-page grid gap-10 py-12 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="font-display text-2xl font-semibold">Your cart</h1>

        <ul className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
          {items.map(({ line, product }) => (
            <li key={line.productId} className="flex items-center gap-4 p-4">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-brand-light/60 text-3xl">
                {product!.imageEmoji}
              </div>
              <div className="flex-1">
                <p className="font-medium">{product!.name}</p>
                <p className="text-sm text-muted">{formatNaira(product!.priceNaira)} / {product!.unit}</p>
              </div>
              <QuantityStepper
                quantity={line.quantity}
                onChange={(n) => setQuantity(line.productId, n)}
              />
              <p className="w-24 text-right font-medium">
                {formatNaira(product!.priceNaira * line.quantity)}
              </p>
              <button
                onClick={() => removeItem(line.productId)}
                className="grid h-8 w-8 place-items-center rounded-full text-muted transition hover:bg-red-50 hover:text-danger"
                aria-label={`Remove ${product!.name}`}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-fit rounded-2xl border border-border bg-surface p-6">
        <h2 className="font-display text-lg font-semibold">Order summary</h2>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-medium">{formatNaira(subtotalNaira)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-muted">Delivery</span>
          <span className="font-medium">Calculated at checkout</span>
        </div>
        <Link
          href="/checkout"
          className="mt-6 block rounded-full bg-brand px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-brand-dark"
        >
          Proceed to checkout
        </Link>
      </div>
    </section>
  );
}
