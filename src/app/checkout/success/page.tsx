import { Suspense } from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { OrderConfirmation } from "@/components/order-confirmation";

// searchParams is runtime-only data, so the part of the page that reads it
// has to sit inside a Suspense boundary for the route to prerender at all.
async function SuccessContent(props: PageProps<"/checkout/success">) {
  const { ref } = (await props.searchParams) as { ref?: string };

  if (!ref) {
    return (
      <section className="container-page flex flex-col items-center py-24 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-red-50 text-danger">
          <XCircle className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold">Missing order reference</h1>
        <p className="mt-2 max-w-md text-sm text-muted">
          We couldn&apos;t find an order reference for this page.
        </p>
        <Link href="/" className="pill-btn mt-6">
          Back to EasyGet
        </Link>
      </section>
    );
  }

  return <OrderConfirmation reference={ref} />;
}

export default function CheckoutSuccessPage(props: PageProps<"/checkout/success">) {
  return (
    <Suspense fallback={null}>
      <SuccessContent {...props} />
    </Suspense>
  );
}
