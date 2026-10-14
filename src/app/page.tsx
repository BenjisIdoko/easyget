import Link from "next/link";
import { ArrowRight, HeadphonesIcon, Stethoscope, HeartPulse, Clock3 } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { ConsultCard } from "@/components/consult-card";
import { getProductsByCategory } from "@/lib/products";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

export default function Home() {
  const pharmacyPicks = getProductsByCategory("pharmacy").slice(0, 4);
  const foodPicks = getProductsByCategory("food").slice(0, 4);

  return (
    <>
      <section className="container-page pb-16 pt-14 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-brand">
            <Clock3 className="h-3.5 w-3.5" /> Delivering in under 45 minutes
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-tight sm:text-5xl">
            Medicine and meals, to your door — fast.
          </h1>
          <p className="mt-4 text-base text-muted sm:text-lg">
            EasyGet pairs a licensed pharmacy with a local food market, so one
            delivery run can cover what your household actually needs today.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-6 sm:grid-cols-2">
          <Link
            href="/pharmacy"
            className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-8 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-pharmacy/10"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-pharmacy-light px-3 py-1 text-xs font-semibold text-pharmacy">
              Verified Healthcare
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold">Pharmacy</h2>
            <p className="mt-2 text-sm text-muted">
              Prescription medication, wellness supplements and first-aid
              essentials, checked by a pharmacist before dispatch.
            </p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-pharmacy">
              Enter Pharmacy <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/food-market"
            className="group relative overflow-hidden rounded-3xl border border-border bg-surface p-8 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-food/10"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-food-light px-3 py-1 text-xs font-semibold text-food">
              Fresh & Fast Kitchen
            </span>
            <h2 className="mt-4 font-display text-2xl font-semibold">Food Market</h2>
            <p className="mt-2 text-sm text-muted">
              Home-style Nigerian meals and everyday groceries, made or
              sourced fresh and bundled into the same delivery.
            </p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-food">
              Enter Food Market <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      <section id="consultations" className="container-page py-16">
        <h2 className="font-display text-2xl font-semibold">Quick Consultations</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">
          Not sure what you need yet? Our team — including a pharmacist on
          24/7 standby — is one message away on WhatsApp.
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <ConsultCard
            icon={HeadphonesIcon}
            title="General Support"
            description="Live order tracking and courier updates."
            href={`https://wa.me/${whatsapp}`}
          />
          <ConsultCard
            icon={Stethoscope}
            title="Talk to a Pharmacist"
            description="Certified medical advice and prescription guidance."
            href={`https://wa.me/${whatsapp}`}
          />
          <ConsultCard
            icon={HeartPulse}
            title="Dietary Consult"
            description="Personalized nutrition and meal curation."
            href={`https://wa.me/${whatsapp}`}
          />
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">Pharmacy picks</h2>
          <Link href="/pharmacy" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pharmacyPicks.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold">From the food market</h2>
          <Link href="/food-market" className="text-sm font-medium text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {foodPicks.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </>
  );
}
