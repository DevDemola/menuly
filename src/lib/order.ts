import type { Business, CartLine, CustomerDetails, Order, OrderLine } from "./types";
import { naira, uid } from "./format";

/**
 * Turn cart lines into priced order lines using the business's own menu,
 * so prices can't be changed by the customer's browser.
 * Unknown or sold-out items are dropped.
 */
export function priceCart(business: Business, cart: CartLine[]): OrderLine[] {
  const lines: OrderLine[] = [];
  for (const c of cart) {
    const item = business.items.find((i) => i.id === c.itemId);
    if (!item || !item.available) continue;
    const qty = Math.max(1, Math.min(99, Math.floor(c.qty || 1)));
    const addOns = item.addOns
      .filter((a) => c.addOnIds.includes(a.id))
      .map((a) => ({ name: a.name, price: a.price }));
    const unit = item.price + addOns.reduce((s, a) => s + a.price, 0);
    lines.push({
      name: item.name,
      qty,
      unitPrice: item.price,
      addOns,
      note: c.note?.trim().slice(0, 200) || undefined,
      lineTotal: unit * qty,
    });
  }
  return lines;
}

export function buildOrder(business: Business, cart: CartLine[], customer: CustomerDetails): Order {
  const lines = priceCart(business, cart);
  return {
    id: uid(5).toUpperCase(),
    slug: business.slug,
    createdAt: new Date().toISOString(),
    customer: {
      name: customer.name.trim().slice(0, 80),
      phone: customer.phone.trim().slice(0, 30),
      mode: customer.mode === "delivery" ? "delivery" : "pickup",
      address: customer.mode === "delivery" ? customer.address?.trim().slice(0, 300) : undefined,
      note: customer.note?.trim().slice(0, 400) || undefined,
    },
    lines,
    total: lines.reduce((s, l) => s + l.lineTotal, 0),
  };
}

/** The message the customer sends to the business on WhatsApp. */
export function orderMessage(business: Business, order: Order, menuUrl?: string) {
  const when = new Date(order.createdAt).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Lagos",
  });
  const out: string[] = [];
  out.push(`*New order — ${business.name}*`);
  out.push(`Order #${order.id} · ${when}`);
  out.push("");
  out.push("*Items*");
  for (const l of order.lines) {
    out.push(`${l.qty}× ${l.name} — ${naira(l.lineTotal)}`);
    for (const a of l.addOns) out.push(`   + ${a.name} (${naira(a.price)})`);
    if (l.note) out.push(`   _Note: ${l.note}_`);
  }
  out.push("");
  out.push(`*Total: ${naira(order.total)}*`);
  if (order.customer.mode === "delivery") out.push("_Delivery fee to be confirmed_");
  out.push("");
  out.push(order.customer.mode === "delivery" ? "*Delivery*" : "*Pickup*");
  out.push(`Name: ${order.customer.name}`);
  out.push(`Phone: ${order.customer.phone}`);
  if (order.customer.mode === "delivery" && order.customer.address) {
    out.push(`Address: ${order.customer.address}`);
  }
  if (order.customer.note) {
    out.push("");
    out.push(`*Note for the kitchen*`);
    out.push(order.customer.note);
  }
  out.push("");
  out.push(menuUrl ? `Sent from ${menuUrl}` : "Sent via Menuly");
  return out.join("\n");
}

/** With no number, WhatsApp lets the sender pick any chat (used for the demo menu). */
export function whatsappLink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
