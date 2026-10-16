import { NextResponse } from "next/server";
import { products } from "@/lib/products";
import { formatNaira } from "@/lib/format";
import type { CartLine, CustomerDetails } from "@/lib/types";

interface CheckoutBody {
  lines: CartLine[];
  customer: CustomerDetails;
}

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

// Payment is cash on delivery for now: the order is handed to the pharmacy
// team as a pre-filled WhatsApp message instead of being charged online.
export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutBody;

  if (!body?.lines?.length) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  if (!body.customer?.fullName || !body.customer?.phone || !body.customer?.address) {
    return NextResponse.json(
      { error: "Name, phone and delivery address are required." },
      { status: 400 }
    );
  }

  if (!WHATSAPP_NUMBER) {
    return NextResponse.json(
      {
        error:
          "Orders aren't configured yet. Set NEXT_PUBLIC_WHATSAPP_NUMBER (see .env.example) to enable checkout.",
      },
      { status: 503 }
    );
  }

  // Price every line server-side from known products — never trust a
  // client-supplied amount or name.
  const priced = body.lines.flatMap((line) => {
    const product = products.find((p) => p.id === line.productId);
    const quantity = Math.floor(Number(line.quantity));
    if (!product || !(quantity > 0)) return [];
    return [{ product, quantity, subtotal: product.priceNaira * quantity }];
  });
  const totalNaira = priced.reduce((sum, l) => sum + l.subtotal, 0);

  if (totalNaira <= 0) {
    return NextResponse.json({ error: "Could not price this cart." }, { status: 400 });
  }

  const reference = `EG-${Date.now().toString(36).toUpperCase()}${Math.random()
    .toString(36)
    .slice(2, 5)
    .toUpperCase()}`;

  const { fullName, phone, email, address, notes } = body.customer;
  const message = [
    `New EasyGet order ${reference}`,
    "",
    ...priced.map(
      (l) => `• ${l.product.name} × ${l.quantity} — ${formatNaira(l.subtotal)}`
    ),
    "",
    `Total: ${formatNaira(totalNaira)} (cash on delivery)`,
    "",
    `Name: ${fullName}`,
    `Phone: ${phone}`,
    ...(email ? [`Email: ${email}`] : []),
    `Address: ${address}`,
    ...(notes ? [`Notes: ${notes}`] : []),
  ].join("\n");

  return NextResponse.json({
    reference,
    whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
  });
}
