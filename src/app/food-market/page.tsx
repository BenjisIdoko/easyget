import type { Metadata } from "next";
import { CategoryBrowser } from "@/components/category-browser";
import { getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Food Market — EasyGet",
};

export default function FoodMarketPage() {
  const products = getProductsByCategory("food");

  return (
    <section className="container-page py-6 md:py-12">
      <div className="rounded-3xl bg-gradient-to-br from-food-light to-surface p-6 ring-1 ring-border/60 md:p-8">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold text-food-dark">
        Fresh & Fast Kitchen
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold">Food Market</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Home-style meals and everyday groceries, made fresh and bundled into
        the same delivery as your pharmacy order.
      </p>
      </div>

      <div className="mt-6">
        <CategoryBrowser products={products} />
      </div>
    </section>
  );
}
