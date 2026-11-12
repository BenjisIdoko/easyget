import { NextResponse } from "next/server";
import type { GroceryConciergeRequest } from "@/lib/types";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const MIN_BUDGET_NAIRA = 2000;

export async function POST(request: Request) {
  const body = (await request.json()) as GroceryConciergeRequest;

  if (!body?.shoppingList?.length) {
    return NextResponse.json(
      { error: "Add at least one item to your shopping list." },
      { status: 400 }
    );
  }
  if (
    !body.customer?.email ||
    !body.customer?.phone ||
    !body.customer?.fullName ||
    !body.customer?.address
  ) {
    return NextResponse.json(
      { error: "Name, phone, email and delivery address are required." },
      { status: 400 }
    );
  }

  const budgetNaira = Math.round(Number(body.budgetNaira));
  if (!Number.isFinite(budgetNaira) || budgetNaira < MIN_BUDGET_NAIRA) {
    return NextResponse.json(
      { error: `Budget must be at least ₦${MIN_BUDGET_NAIRA.toLocaleString()}.` },
      { status: 400 }
    );
  }

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "Payments aren't configured yet. Add PAYSTACK_SECRET_KEY to .env.local (see .env.example) to enable the concierge deposit.",
      },
      { status: 503 }
    );
  }

  const reference = `easyget_concierge_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // The deposit funds the shop itself — reconciliation against the real
  // till receipt (refund or top-up) happens with the customer on delivery,
  // not in this app.
  const init = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: body.customer.email,
      amount: budgetNaira * 100, // Paystack expects kobo
      reference,
      currency: "NGN",
      callback_url: `${SITE_URL}/checkout/success`,
      metadata: {
        type: "grocery-concierge",
        fullName: body.customer.fullName,
        phone: body.customer.phone,
        address: body.customer.address,
        notes: body.customer.notes ?? "",
        preferredStore: body.preferredStore ?? "",
        shoppingList: body.shoppingList,
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
