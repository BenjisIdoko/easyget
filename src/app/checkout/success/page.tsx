import { Suspense } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

async function verify(reference: string) {
  if (!PAYSTACK_SECRET_KEY) {
    return { ok: false, reason: "not-configured" as const };
  }

  const res = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    { headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` }, cache: "no-store" }
  );
  const payload = await res.json();

  if (!res.ok || !payload.status) {
    return { ok: false, reason: "failed" as const };
  }

  return {
    ok: payload.data.status === "success",
    reason: payload.data.status === "success" ? ("paid" as const) : ("failed" as const),
  };
}

// searchParams is runtime-only data, so the part of the page that reads it
// has to sit inside a Suspense boundary for the route to prerender at all.
async function SuccessContent(props: PageProps<"/checkout/success">) {
  const { reference } = (await props.searchParams) as { reference?: string };

  if (!reference) {
    return (
      <StatusPanel icon={XCircle} title="Missing reference" tone="danger">
        We couldn&apos;t find a payment reference for this page.
      </StatusPanel>
    );
  }

  const result = await verify(reference);

  if (result.reason === "not-configured") {
    return (
      <StatusPanel icon={AlertTriangle} title="Payments not configured" tone="warning">
        Add <code>PAYSTACK_SECRET_KEY</code> to your environment to verify
        transactions. Reference: <code>{reference}</code>
      </StatusPanel>
    );
  }

  if (!result.ok) {
    return (
      <StatusPanel icon={XCircle} title="Payment not confirmed" tone="danger">
        We couldn&apos;t confirm this payment. If you were charged, contact
        support with reference <code>{reference}</code>.
      </StatusPanel>
    );
  }

  return (
    <>
      <ClearCartOnMount />
      <StatusPanel icon={CheckCircle2} title="Payment received" tone="success">
        Thanks — your order is confirmed and our team has been notified.
        Reference <code>{reference}</code>.
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
      <p className="mt-4 text-sm text-muted">Confirming your payment…</p>
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
  tone: "success" | "danger" | "warning";
  children: React.ReactNode;
}) {
  const toneClass = {
    success: "text-pharmacy bg-pharmacy-light",
    danger: "text-danger bg-red-50",
    warning: "text-amber-700 bg-amber-50",
  }[tone];

  return (
    <section className="container-page flex flex-col items-center py-24 text-center">
      <span className={`grid h-14 w-14 place-items-center rounded-full ${toneClass}`}>
        <Icon className="h-7 w-7" />
      </span>
      <h1 className="mt-5 font-display text-2xl font-semibold">{title}</h1>
      <p className="mt-2 max-w-md text-sm text-muted">{children}</p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white"
      >
        Back to EasyGet
      </Link>
    </section>
  );
}
