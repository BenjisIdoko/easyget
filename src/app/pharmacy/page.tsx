import type { Metadata } from "next";
import { CategoryBrowser } from "@/components/category-browser";
import { getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Pharmacy — EasyGet",
};

export default function PharmacyPage() {
  const products = getProductsByCategory("pharmacy");

  return (
    <section className="container-page py-12">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-pharmacy-light px-3 py-1 text-xs font-semibold text-pharmacy">
        Verified Healthcare
      </span>
      <h1 className="mt-3 font-display text-3xl font-semibold">Pharmacy</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Every order is reviewed by a licensed pharmacist before it leaves the
        dispensary. Prescription items are flagged on the product page.
      </p>

      <div className="mt-8">
        <CategoryBrowser products={products} />
      </div>
    </section>
  );
}
