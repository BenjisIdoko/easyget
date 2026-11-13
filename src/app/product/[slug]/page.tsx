import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { getProductBySlug, products } from "@/lib/products";
import { formatNaira } from "@/lib/format";
import { AddToCartPanel } from "@/components/add-to-cart-panel";
import { ProductImage } from "@/components/product-image";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage(props: PageProps<"/product/[slug]">) {
  const { slug } = await props.params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const backHref = product.category === "pharmacy" ? "/pharmacy" : "/food-market";

  return (
    <section className="container-page grid gap-0 pb-40 pt-4 md:grid-cols-2 md:gap-10 md:pb-12 md:pt-10">
      <div className="relative h-[42vh] min-h-72 overflow-hidden rounded-[2rem] md:h-full md:min-h-[28rem]">
        <ProductImage key={product.id} product={product} sizes="(min-width: 768px) 50vw, 100vw" preload />
        <Link
          href={backHref}
          aria-label="Back"
          className="absolute left-3 top-3 grid h-11 w-11 place-items-center rounded-full bg-white/90 shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
      </div>

      <div className="relative -mt-6 rounded-t-[2rem] bg-background pt-6 md:mt-0 md:rounded-none md:pt-0">
        <span
          className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            product.category === "pharmacy"
              ? "bg-pharmacy-light text-pharmacy"
              : "bg-food-light text-food-dark"
          }`}
        >
          {product.subcategory}
        </span>

        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight">{product.name}</h1>

        <div className="mt-3 flex items-baseline gap-3">
          <p className="font-display text-3xl font-semibold">{formatNaira(product.priceNaira)}</p>
          <p className="text-sm text-muted">/ {product.unit}</p>
        </div>

        <h2 className="mt-6 font-display text-base font-semibold">Description</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">{product.description}</p>

        {product.requiresPrescription && (
          <p className="mt-4 flex items-start gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
            A valid prescription is required — our pharmacist will confirm by
            WhatsApp before dispatch.
          </p>
        )}

        {product.inStock ? (
          <div id="sticky-cart" className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-lg rounded-full bg-background/90 p-1.5 shadow-xl shadow-black/10 ring-1 ring-border backdrop-blur md:static md:mt-8 md:max-w-none md:bg-transparent md:p-0 md:shadow-none md:ring-0 md:backdrop-blur-none">
            <AddToCartPanel productId={product.id} priceNaira={product.priceNaira} />
          </div>
        ) : (
          <p className="mt-6 rounded-2xl bg-surface px-4 py-3 text-sm font-semibold text-muted ring-1 ring-border">
            Currently out of stock.
          </p>
        )}
      </div>
    </section>
  );
}
