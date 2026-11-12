import { NextResponse } from "next/server";
import { products } from "@/lib/products";
import type { CartLine, CustomerDetails } from "@/lib/types";

interface CheckoutBody {
  lines: CartLine[];
  customer: CustomerDetails;
}

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutBody;

  if (!body?.lines?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  if (!body.customer?.email || !body.customer?.phone || !body.customer?.fullName) {
    return NextResponse.json(
      { error: "Name, phone and email are required." },
      { status: 400 }
    );
  }

  // Recompute the total server-side from known product prices — never trust
  // a client-supplied amount.
  const totalNaira = body.lines.reduce((sum, line) => {
    const product = products.find((p) => p.id === line.productId);
    return sum + (product ? product.priceNaira * line.quantity : 0);
  }, 0);

  if (totalNaira <= 0) {
    return NextResponse.json({ error: "Could not price this cart." }, { status: 400 });
  }

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "Payments aren't configured yet. Add PAYSTACK_SECRET_KEY to .env.local (see .env.example) to enable checkout.",
      },
      { status: 503 }
    );
  }

  const reference = `easyget_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  const init = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: body.customer.email,
      amount: totalNaira * 100, // Paystack expects kobo
      reference,
      currency: "NGN",
      callback_url: `${SITE_URL}/checkout/success`,
      metadata: {
        fullName: body.customer.fullName,
        phone: body.customer.phone,
        address: body.customer.address,
        notes: body.customer.notes ?? "",
        lines: body.lines,
      },
    }),
  });

  const payload = await init.json();

  if (!init.ok || !payload.status) {
    return NextResponse.json(
      { error: payload.message ?? "Paystack could not start this transaction." },
      { status: 502 }
    );
  }

  return NextResponse.json({
    authorizationUrl: payload.data.authorization_url,
    reference: payload.data.reference,
  });
}
