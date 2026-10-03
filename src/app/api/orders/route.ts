import { NextResponse, type NextRequest } from "next/server";
import { getBusiness, saveOrder } from "@/lib/store";
import { buildOrder, orderMessage, whatsappLink } from "@/lib/order";
import type { CartLine, CustomerDetails } from "@/lib/types";

/**
 * Customer checkout. Re-prices the cart from the real menu, records the order
 * for the business's dashboard, and returns a WhatsApp link with the full
 * order written out.
 */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    cart?: CartLine[];
    customer?: CustomerDetails;
  } | null;

  if (!body?.slug || !Array.isArray(body.cart) || !body.customer) {
    return NextResponse.json({ error: "Invalid order." }, { status: 400 });
  }
  const business = await getBusiness(body.slug);
  if (!business) return NextResponse.json({ error: "This menu no longer exists." }, { status: 404 });

  const c = body.customer;
  if (!c.name?.trim() || !c.phone?.trim()) {
    return NextResponse.json({ error: "Please add your name and phone number." }, { status: 400 });
  }
  if (c.mode === "delivery" && !c.address?.trim()) {
    return NextResponse.json({ error: "Please add a delivery address." }, { status: 400 });
  }

  const order = buildOrder(business, body.cart.slice(0, 100), c);
  if (order.lines.length === 0) {
    return NextResponse.json({ error: "The items in your order are no longer available." }, { status: 409 });
  }

  if (!business.demo) await saveOrder(order);

  const origin = req.headers.get("origin") || req.nextUrl.origin;
  const menuUrl = `${origin.replace(/^https?:\/\//, "")}/m/${business.slug}`;
  const message = orderMessage(business, order, menuUrl);

  return NextResponse.json({
    orderId: order.id,
    total: order.total,
    whatsappUrl: whatsappLink(business.demo ? "" : business.whatsapp, message),
    demo: !!business.demo,
    message,
  });
}
