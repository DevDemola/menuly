"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Bike, Check, Loader2, MessageCircle, Store } from "lucide-react";
import { naira } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Business, CustomerDetails, OrderMode } from "@/lib/types";
import type { useCart } from "./useCart";
import { Sheet } from "./Sheet";

const DETAILS_KEY = "menuly:customer";

const field =
  "h-12 w-full rounded-[12px] border border-line-strong bg-paper px-3.5 text-[15px] outline-none placeholder:text-faint focus:border-ink aria-[invalid=true]:border-tomato";

type Cart = ReturnType<typeof useCart>;

export function Checkout({
  open,
  onClose,
  onBack,
  business,
  cart,
}: {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  business: Business;
  cart: Cart;
}) {
  const modes: OrderMode[] = [...(business.pickup ? ["pickup" as const] : []), ...(business.delivery ? ["delivery" as const] : [])];
  const [d, setD] = useState<CustomerDetails>({ name: "", phone: "", mode: modes[0] ?? "pickup", address: "", note: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [sent, setSent] = useState<{ url: string; id: string; total: number } | null>(null);

  // Remember the customer's details for next time (on their own phone only)
  useEffect(() => {
    if (!open) return;
    try {
      const saved = JSON.parse(localStorage.getItem(DETAILS_KEY) || "null");
      if (saved) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- restore saved details when opening
        setD((p) => ({ ...p, name: saved.name ?? "", phone: saved.phone ?? "", address: saved.address ?? "" }));
      }
    } catch {}
  }, [open]);

  const set = <K extends keyof CustomerDetails>(k: K, v: CustomerDetails[K]) => {
    setD((p) => ({ ...p, [k]: v }));
    setErrors((e) => (e[k] ? { ...e, [k]: "" } : e));
  };

  const submit = async () => {
    const e: Record<string, string> = {};
    if (!d.name.trim()) e.name = "Add your name.";
    if (d.phone.replace(/\D/g, "").length < 7) e.phone = "Add a phone number we can reach you on.";
    if (d.mode === "delivery" && !d.address?.trim()) e.address = "Where should we deliver to?";
    setErrors(e);
    if (Object.keys(e).length) return;

    setSending(true);
    setServerError(null);
    try {
      localStorage.setItem(DETAILS_KEY, JSON.stringify({ name: d.name, phone: d.phone, address: d.address }));
    } catch {}
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: business.slug,
          cart: cart.lines.map(({ itemId, qty, addOnIds, note }) => ({ itemId, qty, addOnIds, note })),
          customer: d,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setSent({ url: data.whatsappUrl, id: data.orderId, total: data.total });
      cart.clear();
      // Hand over to WhatsApp (app on phones, WhatsApp Web on computers)
      window.location.href = data.whatsappUrl;
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Couldn’t send your order. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const close = () => {
    setSent(null);
    onClose();
  };

  return (
    <Sheet open={open} onClose={close} label="Checkout" full>
      {sent ? (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-14 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-leaf text-paper">
            <Check className="h-8 w-8" strokeWidth={3} />
          </span>
          <h2 className="mt-5 font-display text-[26px] font-bold tracking-[-0.03em]">Almost done!</h2>
          <p className="mt-2 max-w-[22rem] text-[15px] leading-relaxed text-ink-2">
            WhatsApp should be opening with your order <span className="font-semibold text-ink">#{sent.id}</span> already
            written. Just tap <span className="font-semibold text-ink">Send</span> so {business.name} receives it.
          </p>
          <a
            href={sent.url}
            className="mt-7 flex h-13 w-full max-w-[22rem] items-center justify-center gap-2 rounded-[14px] bg-leaf text-[15.5px] font-semibold text-paper"
          >
            <MessageCircle className="h-5 w-5" /> Open WhatsApp
          </a>
          <button onClick={close} className="mt-4 text-[14px] font-medium text-muted underline underline-offset-4">
            Back to menu
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 border-b border-line px-4 pb-4 pt-5">
            <button onClick={onBack} className="grid h-9 w-9 place-items-center rounded-full hover:bg-cream" aria-label="Back to your order">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="font-display text-xl font-bold tracking-[-0.02em]">Checkout</h2>
          </div>

          <form
            className="flex-1 overflow-y-auto px-5 pb-6 pt-5"
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            noValidate
            id="checkout-form"
          >
            {modes.length > 1 && (
              <div className="grid grid-cols-2 gap-1 rounded-[14px] bg-cream p-1" role="radiogroup" aria-label="Pickup or delivery">
                {modes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={d.mode === m}
                    onClick={() => set("mode", m)}
                    className={cn(
                      "flex h-11 items-center justify-center gap-2 rounded-[11px] text-[14.5px] font-medium transition-colors",
                      d.mode === m ? "bg-paper shadow-card" : "text-muted",
                    )}
                  >
                    {m === "pickup" ? <Store className="h-4 w-4" /> : <Bike className="h-4 w-4" />}
                    {m === "pickup" ? "Pickup" : "Delivery"}
                  </button>
                ))}
              </div>
            )}
            {modes.length === 1 && (
              <p className="rounded-[12px] bg-cream px-4 py-3 text-[14px] text-ink-2">
                {modes[0] === "pickup" ? "This order is for pickup." : "This order is for delivery."}
              </p>
            )}

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[13.5px] font-medium">Your name</span>
                <input className={field} value={d.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" placeholder="e.g. Adaeze Okafor" aria-invalid={!!errors.name} />
                {errors.name && <span className="mt-1 block text-[12.5px] text-tomato">{errors.name}</span>}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[13.5px] font-medium">Phone number</span>
                <input className={field} value={d.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" inputMode="tel" placeholder="0803 000 0000" aria-invalid={!!errors.phone} />
                {errors.phone && <span className="mt-1 block text-[12.5px] text-tomato">{errors.phone}</span>}
              </label>
              {d.mode === "delivery" && (
                <label className="block">
                  <span className="mb-1.5 block text-[13.5px] font-medium">Delivery address</span>
                  <textarea
                    className={cn(field, "h-auto resize-none py-3 leading-relaxed")}
                    rows={3}
                    value={d.address}
                    onChange={(e) => set("address", e.target.value)}
                    autoComplete="street-address"
                    placeholder="House number, street, area, landmark"
                    aria-invalid={!!errors.address}
                  />
                  {errors.address && <span className="mt-1 block text-[12.5px] text-tomato">{errors.address}</span>}
                </label>
              )}
              <label className="block">
                <span className="mb-1.5 block text-[13.5px] font-medium">
                  Anything else we should know? <span className="font-normal text-muted">Optional</span>
                </span>
                <textarea
                  className={cn(field, "h-auto resize-none py-3 leading-relaxed")}
                  rows={2}
                  value={d.note}
                  onChange={(e) => set("note", e.target.value)}
                  placeholder="e.g. Call when you get to the gate"
                />
              </label>
            </div>

            <div className="mt-6 rounded-[14px] border border-line p-4">
              <p className="text-[13.5px] font-semibold">Order summary</p>
              <ul className="mt-2 space-y-1.5 text-[13.5px]">
                {cart.lines.map((l) => {
                  const item = business.items.find((i) => i.id === l.itemId)!;
                  return (
                    <li key={l.key} className="flex justify-between gap-3">
                      <span className="text-ink-2">
                        {l.qty}× {item.name}
                      </span>
                      <span className="tabular-nums">{naira(cart.priceOf(l))}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 flex justify-between border-t border-dashed border-line-strong pt-3 text-[15px] font-semibold">
                <span>Total</span>
                <span className="tabular-nums">{naira(cart.total)}</span>
              </div>
              {d.mode === "delivery" && <p className="mt-1 text-[12px] text-muted">Delivery fee will be confirmed on WhatsApp.</p>}
            </div>

            {serverError && (
              <p className="mt-4 rounded-[10px] bg-tomato-soft px-3.5 py-3 text-[13.5px] text-tomato" role="alert">
                {serverError}
              </p>
            )}
          </form>

          <div className="border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <button
              type="submit"
              form="checkout-form"
              disabled={sending || cart.lines.length === 0}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-leaf text-[15.5px] font-semibold text-paper transition-opacity disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5" />}
              {sending ? "Preparing your order…" : `Send order on WhatsApp · ${naira(cart.total)}`}
            </button>
            <p className="mt-2 text-center text-[12px] text-muted">You’ll review the message in WhatsApp before it’s sent.</p>
          </div>
        </>
      )}
    </Sheet>
  );
}
