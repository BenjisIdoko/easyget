import { NextResponse } from "next/server";
import { products } from "@/lib/products";
import { getVendor } from "@/lib/menus";
import type { CartLine } from "@/lib/types";
import type { OrderGroup, OrderSummary } from "@/lib/orders";

interface OrderBody {
  lines: CartLine[];
  customer: { fullName: string; phone: string; address: string; notes?: string };
}

/**
 * Pay-on-delivery order. Prices are recomputed here from the catalog; never
 * trust a client-supplied amount. The order is split into one group per
 * restaurant (pharmacy items form their own group).
 *
 * Nothing is stored yet: once Supabase is connected this is where the order
 * and its per-vendor groups get inserted and the team gets notified.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as OrderBody;

  if (!Array.isArray(body?.lines) || body.lines.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  const { fullName, phone, address, notes } = body.customer ?? {};
  if (!fullName?.trim() || !phone?.trim() || !address?.trim()) {
    return NextResponse.json(
      { error: "Name, phone number and delivery address are required." },
      { status: 400 }
    );
  }

  const groups = new Map<string, OrderGroup>();
  for (const line of body.lines) {
    const product = products.find((p) => p.id === line.productId);
    const quantity = Math.floor(Number(line.quantity));
    if (!product || !product.inStock || !(quantity >= 1 && quantity <= 99)) {
      return NextResponse.json(
        { error: "Some items in your cart are no longer available. Please review your cart." },
        { status: 400 }
      );
    }
    const label = getVendor(product.vendorId)?.name ?? "Pharmacy";
    const group = groups.get(label) ?? { label, items: [], subtotalNaira: 0 };
    const subtotalNaira = product.priceNaira * quantity;
    group.items.push({ name: product.name, quantity, subtotalNaira });
    group.subtotalNaira += subtotalNaira;
    groups.set(label, group);
  }

  const orderGroups = [...groups.values()];
  const order: OrderSummary = {
    reference: `EG-${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 5)
      .toUpperCase()}`,
    totalNaira: orderGroups.reduce((sum, g) => sum + g.subtotalNaira, 0),
    customer: {
      fullName: fullName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      notes: notes?.trim() || undefined,
    },
    groups: orderGroups,
  };

  return NextResponse.json(order);
}
