import { notFound } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getProductBySlug, products } from "@/lib/products";
import { formatNaira } from "@/lib/format";
import { AddToCartPanel } from "@/components/add-to-cart-panel";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  return (
    <section className="container-page grid gap-10 py-12 md:grid-cols-2">
      <div className="grid h-72 place-items-center rounded-3xl bg-brand-light/60 text-8xl md:h-full">
        {product.imageEmoji}
      </div>

      <div>
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            product.category === "pharmacy"
              ? "bg-pharmacy-light text-pharmacy"
              : "bg-food-light text-food"
          }`}
        >
          {product.subcategory}
        </span>

        <h1 className="mt-3 font-display text-3xl font-semibold">{product.name}</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">{product.description}</p>

        {product.requiresPrescription && (
          <p className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700">
            <ShieldCheck className="h-4 w-4" />
            A valid prescription is required — our pharmacist will confirm by
            WhatsApp before dispatch.
          </p>
        )}

        <div className="mt-6 flex items-baseline gap-3">
          <p className="font-display text-3xl font-semibold">
            {formatNaira(product.priceNaira)}
          </p>
          <p className="text-sm text-muted">/ {product.unit}</p>
        </div>

        <div className="mt-6">
          <AddToCartPanel productId={product.id} />
        </div>
      </div>
    </section>
  );
}
