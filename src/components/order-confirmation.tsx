"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";
import { formatNaira } from "@/lib/format";
import { LAST_ORDER_KEY, orderToWhatsAppText, type OrderSummary } from "@/lib/orders";

const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "2348000000000";

const subscribe = () => () => {};
const readOrder = () => window.sessionStorage.getItem(LAST_ORDER_KEY);
const readServer = () => null;

export function OrderConfirmation({ reference }: { reference: string }) {
  const raw = useSyncExternalStore(subscribe, readOrder, readServer);

  const order = useMemo(() => {
    try {
      const parsed = raw ? (JSON.parse(raw) as OrderSummary) : null;
      return parsed?.reference === reference ? parsed : null;
    } catch {
      return null;
    }
  }, [raw, reference]);

  const whatsappHref = order
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(orderToWhatsAppText(order))}`
    : `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi EasyGet, about my order ${reference}`)}`;

  return (
    <section className="container-page flex flex-col items-center py-12 text-center sm:py-20">
      {order && <ClearCartOnMount />}
      <span className="pop-in grid h-14 w-14 place-items-center rounded-full bg-pharmacy-light text-pharmacy">
        <CheckCircle2 className="h-7 w-7" />
      </span>
      <h1 className="rise-in mt-5 font-display text-2xl font-semibold">
        {order ? "Almost done: send your order" : "Order reference"}
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        {order ? (
          <>
            Tap the button to send order <code>{reference}</code> to our team on
            WhatsApp. They&apos;ll confirm the delivery fee and your delivery
            time. You pay on delivery.
          </>
        ) : (
          <>
            We couldn&apos;t load the details for <code>{reference}</code> on
            this device. Message us on WhatsApp with this reference and we&apos;ll
            find your order.
          </>
        )}
      </p>

      {order && (
        <div className="mt-6 w-full max-w-md space-y-4 rounded-3xl bg-surface p-5 text-left ring-1 ring-border/70">
          {order.groups.map((g) => (
            <div key={g.label}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {g.label}
              </p>
              <ul className="mt-1.5 space-y-1 text-sm">
                {g.items.map((i) => (
                  <li key={i.name} className="flex justify-between gap-3">
                    <span className="text-muted">
                      {i.name} × {i.quantity}
                    </span>
                    <span className="font-medium">{formatNaira(i.subtotalNaira)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-3 font-semibold">
            <span>Total (pay on delivery)</span>
            <span>{formatNaira(order.totalNaira)}</span>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="pill-btn h-12 bg-pharmacy hover:bg-pharmacy/90"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          {order ? "Send order on WhatsApp" : "Message us on WhatsApp"}
        </a>
        <Link
          href="/"
          className="press inline-flex min-h-12 items-center rounded-full bg-surface px-6 text-sm font-semibold ring-1 ring-border"
        >
          Back to EasyGet
        </Link>
      </div>
    </section>
  );
}
