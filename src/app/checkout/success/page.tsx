import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, MessageCircle } from "lucide-react";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

// searchParams is runtime-only data, so the part of the page that reads it
// has to sit inside a Suspense boundary for the route to prerender at all.
async function SuccessContent(props: PageProps<"/checkout/success">) {
  const { reference, wa } = (await props.searchParams) as {
    reference?: string;
    wa?: string;
  };

  // Only ever link to WhatsApp — this param comes from the URL.
  const whatsappUrl = wa?.startsWith("https://wa.me/") ? wa : null;

  if (!reference || !whatsappUrl) {
    return (
      <StatusPanel icon={XCircle} title="Order not found" tone="danger">
        We couldn&apos;t find an order for this page. Please place your order
        again from the cart.
      </StatusPanel>
    );
  }

  return (
    <>
      <ClearCartOnMount />
      <StatusPanel icon={CheckCircle2} title="Almost done — send your order" tone="success">
        Your order <code>{reference}</code> is ready. Tap the button below to
        send it to our team on WhatsApp. You&apos;ll pay cash on delivery.
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-pharmacy px-5 py-2.5 text-sm font-semibold text-white"
        >
          <MessageCircle className="h-4 w-4" />
          Send order on WhatsApp
        </a>
      </StatusPanel>
    </>
  );
}

export default function CheckoutSuccessPage(props: PageProps<"/checkout/success">) {
  return (
    <Suspense fallback={<LoadingPanel />}>
      <SuccessContent {...props} />
    </Suspense>
  );
}

function LoadingPanel() {
  return (
    <section className="container-page flex flex-col items-center py-24 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-brand" />
      <p className="mt-4 text-sm text-muted">Loading your order…</p>
    </section>
  );
}

function StatusPanel({
  icon: Icon,
  title,
  tone,
  children,
}: {
  icon: typeof CheckCircle2;
  title: string;
  tone: "success" | "danger";
  children: React.ReactNode;
}) {
  const toneClass = {
    success: "text-pharmacy bg-pharmacy-light",
    danger: "text-danger bg-red-50",
  }[tone];

  return (
    <section className="container-page flex flex-col items-center py-24 text-center">
      <span className={`grid h-14 w-14 place-items-center rounded-full ${toneClass}`}>
        <Icon className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-semibold">{title}</h1>
      <div className="mt-2 flex max-w-md flex-col items-center text-sm text-muted">
        {children}
      </div>
      <Link
        href="/"
        className="mt-6 rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
      >
        Back to EasyGet
      </Link>
    </section>
  );
}
