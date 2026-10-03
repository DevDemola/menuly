"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Clock, MapPin, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { LogoMark } from "@/components/ui/Logo";
import { naira } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Business, Item } from "@/lib/types";
import { useCart } from "./useCart";
import { Sheet } from "./Sheet";
import { Checkout } from "./Checkout";

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "M";

export function MenuApp({ business }: { business: Business }) {
  const cart = useCart(business);
  const [query, setQuery] = useState("");
  const [openItem, setOpenItem] = useState<Item | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const accent = business.accent;

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return business.categories
      .map((c) => ({
        ...c,
        items: business.items.filter(
          (i) =>
            i.categoryId === c.id &&
            (!q || i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q)),
        ),
      }))
      .filter((s) => s.items.length > 0);
  }, [business, query]);

  // Highlight the category currently on screen
  useEffect(() => {
    const els = Object.values(sectionRefs.current).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveCat(visible[0].target.getAttribute("data-cat"));
      },
      { rootMargin: "-120px 0px -60% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  const quickAdd = (item: Item) => {
    if (item.addOns.length) return setOpenItem(item);
    cart.add({ itemId: item.id, qty: 1, addOnIds: [] });
    setToast(`${item.name} added`);
  };

  const scrollTo = (id: string) => {
    const el = sectionRefs.current[id];
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
  };

  const current = activeCat ?? sections[0]?.id;

  return (
    <div className="min-h-dvh bg-cream-2/60 sm:py-8" style={{ ["--accent" as string]: accent }}>
      <div className="relative mx-auto min-h-dvh max-w-[520px] bg-paper pb-32 sm:min-h-0 sm:overflow-hidden sm:rounded-[20px] sm:shadow-lift">
        {business.demo && (
          <div className="bg-ink px-4 py-2 text-center text-[12.5px] text-paper/85">
            Demo menu — checkout opens WhatsApp so you can send the order to any chat.
          </div>
        )}

        {/* Cover + identity */}
        <header>
          <div className="relative h-44 bg-cream-2 sm:h-52">
            {business.cover ? (
              <Photo src={business.cover} alt="" className="h-full w-full" tone="deep" priority />
            ) : (
              <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${accent}, #1d1a16)` }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
          <div className="px-5">
            <div
              className="relative z-10 -mt-9 grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-[18px] border-4 border-paper font-display text-xl font-bold text-paper shadow-card"
              style={{ background: accent }}
            >
              {business.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={business.logo} alt={`${business.name} logo`} className="h-full w-full object-cover" />
              ) : (
                initials(business.name)
              )}
            </div>
            <h1 className="mt-3 font-display text-[28px] font-bold leading-[1.05] tracking-[-0.035em]">{business.name}</h1>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
              <span className="inline-flex items-center gap-1.5 font-medium text-leaf">
                <span className="h-2 w-2 rounded-full bg-leaf animate-pulse-dot" /> {business.hours}
              </span>
              {business.area && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {business.area}
                </span>
              )}
            </div>
            <p className="mt-3 text-[13px] leading-relaxed text-ink-2">
              Pick what you’d like, then send your order straight to us on WhatsApp.
              {business.pickup && business.delivery ? " Pickup or delivery." : business.delivery ? " Delivery available." : " Pickup only."}
            </p>

            <label className="mt-4 flex h-11 items-center gap-2 rounded-[12px] bg-cream px-3.5 text-[14px] focus-within:ring-2 focus-within:ring-[var(--accent)]/40">
              <Search className="h-4 w-4 text-faint" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search the menu"
                className="h-full flex-1 bg-transparent outline-none placeholder:text-faint"
                aria-label="Search the menu"
              />
              {query && (
                <button onClick={() => setQuery("")} aria-label="Clear search" className="text-muted">
                  <X className="h-4 w-4" />
                </button>
              )}
            </label>
          </div>
        </header>

        {/* Category tabs */}
        {sections.length > 1 && (
          <nav className="no-scrollbar sticky top-0 z-20 mt-4 flex gap-5 overflow-x-auto border-b border-line bg-paper/95 px-5 pt-3 backdrop-blur" aria-label="Menu categories">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={cn(
                  "shrink-0 border-b-2 pb-2.5 text-[14px] font-medium transition-colors",
                  current === s.id ? "text-ink" : "border-transparent text-muted hover:text-ink",
                )}
                style={current === s.id ? { borderColor: accent } : undefined}
              >
                {s.name}
              </button>
            ))}
          </nav>
        )}

        {/* Items */}
        <main className="px-5">
          {sections.length === 0 && (
            <p className="py-16 text-center text-[14px] text-muted">
              {query ? `Nothing matches “${query}”.` : "This menu is being prepared. Check back soon."}
            </p>
          )}
          {sections.map((s) => (
            <section
              key={s.id}
              ref={(el) => {
                sectionRefs.current[s.id] = el;
              }}
              data-cat={s.id}
              className="pt-6"
              aria-labelledby={`cat-${s.id}`}
            >
              <h2 id={`cat-${s.id}`} className="font-display text-[19px] font-semibold tracking-[-0.02em]">
                {s.name}
              </h2>
              <ul className="divide-y divide-line">
                {s.items.map((item) => (
                  <li key={item.id}>
                    <div className={cn("relative flex gap-4 py-4", !item.available && "opacity-55")}>
                      <button
                        className="absolute inset-0 z-0"
                        onClick={() => item.available && setOpenItem(item)}
                        disabled={!item.available}
                        aria-label={`${item.name}, ${naira(item.price)}${item.available ? "" : ", sold out"}`}
                      />
                      <div className="pointer-events-none min-w-0 flex-1">
                        <p className="text-[15px] font-semibold leading-snug">{item.name}</p>
                        {item.description && (
                          <p className="mt-1 line-clamp-2 text-[13px] leading-[1.45] text-muted">{item.description}</p>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-[14.5px] font-semibold tabular-nums">{naira(item.price)}</span>
                          {!item.available ? (
                            <span className="text-[12px] font-medium text-tomato">Sold out today</span>
                          ) : (
                            item.tag && (
                              <span
                                className="rounded-[4px] px-1.5 py-px text-[10.5px] font-semibold uppercase tracking-wide"
                                style={{ color: accent, background: `${accent}1f` }}
                              >
                                {item.tag}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                      <div className={cn("relative shrink-0", item.photo ? "h-[92px] w-[92px]" : "w-9 self-end")}>
                        {item.photo && (
                          <Photo src={item.photo} alt="" className="pointer-events-none h-full w-full rounded-[12px]" />
                        )}
                        {item.available && (
                          <button
                            onClick={() => quickAdd(item)}
                            className={cn(
                              "z-10 grid h-9 w-9 place-items-center rounded-full border-[3px] border-paper text-paper shadow-card transition-transform active:scale-95",
                              item.photo ? "absolute -bottom-2 -right-2" : "relative",
                            )}
                            style={{ background: accent }}
                            aria-label={`Add ${item.name}`}
                          >
                            <Plus className="h-4 w-4" strokeWidth={2.75} />
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <footer className="mt-12 flex items-center justify-center gap-1.5 pb-4 text-[12px] text-faint">
            Menu by <LogoMark className="h-4 w-4" /> <span className="font-display font-bold tracking-tight text-muted">menuly</span>
          </footer>
        </main>

        {/* Cart bar */}
        {cart.count > 0 && (
          <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[520px] bg-gradient-to-t from-paper via-paper/95 to-transparent px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-6 sm:bottom-8">
            <button
              onClick={() => setCartOpen(true)}
              className="flex h-14 w-full items-center justify-between rounded-[16px] bg-ink px-4 text-paper shadow-lift transition-transform active:scale-[0.99]"
            >
              <span className="flex items-center gap-2.5 text-[15px] font-medium">
                <span className="grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-[13px] font-bold" style={{ background: accent }}>
                  {cart.count}
                </span>
                View order
              </span>
              <span className="text-[15px] font-semibold tabular-nums">{naira(cart.total)}</span>
            </button>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="fixed inset-x-0 bottom-24 z-40 flex justify-center px-4" role="status">
            <span className="flex items-center gap-2 rounded-full bg-ink py-2 pl-2 pr-4 text-[13px] font-medium text-paper shadow-lift animate-rise">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-leaf">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {toast}
            </span>
          </div>
        )}
      </div>

      <ItemSheet
        item={openItem}
        accent={accent}
        onClose={() => setOpenItem(null)}
        onAdd={(line, name) => {
          cart.add(line);
          setOpenItem(null);
          setToast(`${name} added`);
        }}
      />

      <Sheet open={cartOpen} onClose={() => setCartOpen(false)} label="Your order">
        <div className="flex items-center gap-2 border-b border-line px-5 pb-4 pt-5">
          <ShoppingBag className="h-5 w-5" />
          <h2 className="font-display text-xl font-bold tracking-[-0.02em]">Your order</h2>
        </div>
        <div className="flex-1 overflow-y-auto px-5">
          {cart.lines.length === 0 && <p className="py-10 text-center text-[14px] text-muted">Your order is empty.</p>}
          <ul className="divide-y divide-line">
            {cart.lines.map((l) => {
              const item = business.items.find((i) => i.id === l.itemId)!;
              const extras = item.addOns.filter((a) => l.addOnIds.includes(a.id));
              return (
                <li key={l.key} className="flex gap-3 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-[14.5px] font-semibold">{item.name}</p>
                    {extras.length > 0 && (
                      <p className="mt-0.5 text-[12.5px] text-muted">+ {extras.map((a) => a.name).join(", ")}</p>
                    )}
                    {l.note && <p className="mt-0.5 text-[12.5px] italic text-muted">“{l.note}”</p>}
                    <p className="mt-1.5 text-[14px] font-medium tabular-nums">{naira(cart.priceOf(l))}</p>
                  </div>
                  <div className="flex h-10 items-center gap-1 self-center rounded-[12px] bg-cream px-1">
                    <button
                      onClick={() => cart.setQty(l.key, l.qty - 1)}
                      className="grid h-8 w-8 place-items-center rounded-[9px] hover:bg-paper"
                      aria-label={`Remove one ${item.name}`}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-5 text-center text-[14px] font-semibold tabular-nums">{l.qty}</span>
                    <button
                      onClick={() => cart.setQty(l.key, l.qty + 1)}
                      className="grid h-8 w-8 place-items-center rounded-[9px] hover:bg-paper"
                      aria-label={`Add one ${item.name}`}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
        {cart.lines.length > 0 && (
          <div className="border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
            <div className="flex items-baseline justify-between">
              <span className="text-[14px] text-muted">Total</span>
              <span className="font-display text-2xl font-bold tabular-nums tracking-tight">{naira(cart.total)}</span>
            </div>
            <button
              onClick={() => {
                setCartOpen(false);
                setCheckoutOpen(true);
              }}
              className="mt-4 flex h-13 w-full items-center justify-center rounded-[14px] text-[15.5px] font-semibold text-paper"
              style={{ background: accent }}
            >
              Checkout
            </button>
          </div>
        )}
      </Sheet>

      <Checkout
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onBack={() => {
          setCheckoutOpen(false);
          setCartOpen(true);
        }}
        business={business}
        cart={cart}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ItemSheet({
  item,
  accent,
  onClose,
  onAdd,
}: {
  item: Item | null;
  accent: string;
  onClose: () => void;
  onAdd: (line: { itemId: string; qty: number; addOnIds: string[]; note?: string }, name: string) => void;
}) {
  return (
    <Sheet open={!!item} onClose={onClose} label={item?.name ?? "Item"}>
      {item && <ItemSheetBody key={item.id} item={item} accent={accent} onAdd={onAdd} />}
    </Sheet>
  );
}

function ItemSheetBody({
  item,
  accent,
  onAdd,
}: {
  item: Item;
  accent: string;
  onAdd: (line: { itemId: string; qty: number; addOnIds: string[]; note?: string }, name: string) => void;
}) {
  const [qty, setQty] = useState(1);
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const extras = item.addOns.filter((a) => picked.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const total = (item.price + extras) * qty;

  return (
    <>
      <div className="flex-1 overflow-y-auto">
        {item.photo && <Photo src={item.photo} alt={item.name} className="h-60 w-full sm:h-72" priority />}
        <div className={cn("px-5 pb-6", item.photo ? "pt-5" : "pt-14")}>
          <div className="flex items-start justify-between gap-4">
            <h2 className="font-display text-[24px] font-bold leading-[1.1] tracking-[-0.03em]">{item.name}</h2>
            <span className="pt-1 text-[17px] font-semibold tabular-nums">{naira(item.price)}</span>
          </div>
          {item.description && <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{item.description}</p>}

          {item.addOns.length > 0 && (
            <fieldset className="mt-6">
              <legend className="flex w-full items-baseline justify-between border-t border-line pt-4">
                <span className="text-[14.5px] font-semibold">Add-ons</span>
              </legend>
              <span className="text-[12.5px] text-muted">Optional — choose any</span>
              <div className="mt-2">
                {item.addOns.map((a) => {
                  const on = picked.includes(a.id);
                  return (
                    <label key={a.id} className="flex cursor-pointer items-center gap-3 py-2.5 text-[14.5px]">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={on}
                        onChange={() => setPicked((p) => (on ? p.filter((x) => x !== a.id) : [...p, a.id]))}
                      />
                      <span
                        className={cn(
                          "grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[6px] border-[1.5px] transition-colors",
                          on ? "border-transparent text-paper" : "border-line-strong",
                        )}
                        style={on ? { background: accent } : undefined}
                        aria-hidden
                      >
                        {on && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                      </span>
                      <span className="flex-1">{a.name}</span>
                      <span className="tabular-nums text-muted">+{naira(a.price)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          <label className="mt-5 block border-t border-line pt-4">
            <span className="text-[14.5px] font-semibold">Special request</span>
            <span className="ml-2 text-[12.5px] text-muted">Optional</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={200}
              rows={2}
              placeholder="e.g. no onions, extra pepper"
              className="mt-2 w-full resize-none rounded-[10px] border border-line-strong bg-paper px-3 py-2.5 text-[14px] outline-none placeholder:text-faint focus:border-ink"
            />
          </label>

          <p className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] text-muted">
            <Clock className="h-3.5 w-3.5" /> Confirmed with you on WhatsApp after you order
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t border-line bg-paper px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
        <div className="flex h-13 items-center gap-1 rounded-[14px] bg-cream px-1.5">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-[10px] hover:bg-paper" aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-6 text-center text-[16px] font-semibold tabular-nums" aria-live="polite">{qty}</span>
          <button onClick={() => setQty((q) => Math.min(99, q + 1))} className="grid h-10 w-10 place-items-center rounded-[10px] hover:bg-paper" aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={() => onAdd({ itemId: item.id, qty, addOnIds: picked, note: note.trim() || undefined }, item.name)}
          className="flex h-13 flex-1 items-center justify-between gap-2 rounded-[14px] px-4 text-[15px] font-semibold text-paper"
          style={{ background: accent }}
        >
          <span>Add to order</span>
          <span className="tabular-nums">{naira(total)}</span>
        </button>
      </div>
    </>
  );
}
