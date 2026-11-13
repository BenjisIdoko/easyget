import Link from "next/link";
import {
  ArrowRight,
  HeadphonesIcon,
  Stethoscope,
  HeartPulse,
  Pill,
  UtensilsCrossed,
  ShoppingBasket,
  PartyPopper,
} from "lucide-react";
import { HomeBrowser } from "@/components/home-browser";
import { ConsultCard } from "@/components/consult-card";
import { products } from "@/lib/products";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

// Placeholder promo copy — edit freely.
const promo = {
  title: "Free delivery on your first order",
  body: "Meals and medicine at your door in under 45 minutes.",
  cta: "Order now",
  href: "/food-market",
};

const services = [
  { href: "/pharmacy", title: "Pharmacy", note: "Verified healthcare", icon: Pill, tone: "bg-pharmacy-light text-pharmacy" },
  { href: "/food-market", title: "Food Market", note: "Fresh & fast kitchen", icon: UtensilsCrossed, tone: "bg-food-light text-food-dark" },
  { href: "/grocery-concierge", title: "Grocery Concierge", note: "Budget + list", icon: ShoppingBasket, tone: "bg-brand-light text-brand-dark" },
  { href: "/catering", title: "Catering & Events", note: "Bulk quotes", icon: PartyPopper, tone: "bg-brand-light text-brand-dark" },
] as const;

export default function Home() {
  return (
    <>
      <section className="container-page pt-6 sm:pt-10">
        <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
          Hungry or unwell? <span aria-hidden>👋</span>
        </h1>
        <p className="mt-1 text-sm text-muted sm:text-base">
          Medicine and meals, to your door — fast.
        </p>

        <div className="mt-5">
          <HomeBrowser products={products}>
            <div className="relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-br from-brand to-brand-dark p-6 text-white">
              <div className="max-w-[16rem] sm:max-w-md">
                <p className="font-display text-2xl font-semibold leading-tight">{promo.title}</p>
                <p className="mt-2 text-sm text-white/85">{promo.body}</p>
                <Link href={promo.href} className="pill-btn mt-4 !bg-white !text-ink hover:!bg-brand-light">
                  {promo.cta} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <span className="absolute -bottom-2 -right-1 text-[6.5rem] leading-none opacity-95 sm:right-10 sm:text-[8rem]" aria-hidden>
                🍲
              </span>
            </div>
          </HomeBrowser>
        </div>
      </section>

      <section className="container-page pt-12">
        <h2 className="font-display text-xl font-semibold">Everything EasyGet</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
          {services.map(({ href, title, note, icon: Icon, tone }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-3 rounded-3xl bg-surface p-4 ring-1 ring-border/70 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand/10"
            >
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${tone}`}>
                <Icon className="h-6 w-6" />
              </span>
              <span>
                <span className="block font-display text-base font-semibold">{title}</span>
                <span className="block text-xs text-muted">{note}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="consultations" className="container-page pt-12">
        <h2 className="font-display text-xl font-semibold">Quick consultations</h2>
        <p className="mt-1 max-w-xl text-sm text-muted">
          Not sure what you need yet? Our team — including a pharmacist on 24/7
          standby — is one message away on WhatsApp.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 sm:gap-4">
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
    </>
  );
}
