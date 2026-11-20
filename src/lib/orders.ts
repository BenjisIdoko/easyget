import { formatNaira } from "./format";

export interface OrderGroup {
  /** Restaurant name, or "Pharmacy" for pharmacy items. One group becomes one vendor order. */
  label: string;
  items: { name: string; quantity: number; subtotalNaira: number }[];
  subtotalNaira: number;
}

export interface OrderSummary {
  reference: string;
  totalNaira: number;
  customer: { fullName: string; phone: string; address: string; notes?: string };
  groups: OrderGroup[];
}

export const LAST_ORDER_KEY = "easyget-last-order";

/** The order as a WhatsApp message to the EasyGet team (payment is on delivery). */
export function orderToWhatsAppText(order: OrderSummary) {
  const lines = [
    `Hi EasyGet, new order ${order.reference} (pay on delivery)`,
    "",
    ...order.groups.flatMap((g) => [
      `*${g.label}*`,
      ...g.items.map((i) => `${i.quantity} x ${i.name} - ${formatNaira(i.subtotalNaira)}`),
      "",
    ]),
    `Total: ${formatNaira(order.totalNaira)} (delivery fee confirmed by us)`,
    "",
    `Name: ${order.customer.fullName}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}`,
    order.customer.notes ? `Notes: ${order.customer.notes}` : null,
  ].filter((l): l is string => l !== null);
  return lines.join("\n");
}
