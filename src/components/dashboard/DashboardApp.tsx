"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import QRCode from "qrcode";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  ImagePlus,
  Loader2,
  MessageCircle,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { QrCode } from "@/components/ui/QrCode";
import { Toggle } from "@/components/dashboard/AvailabilityList";
import { Sheet } from "@/components/menu-app/Sheet";
import { inputClass } from "@/components/auth/Field";
import { compressImage } from "@/lib/image-client";
import { formatPhone, naira, toWhatsAppNumber, uid } from "@/lib/format";
import { cn } from "@/lib/cn";
import type { Business, Item, Order } from "@/lib/types";

type Tab = "menu" | "orders" | "share" | "settings";
type SaveState = "idle" | "saving" | "saved" | "error";

function useOrigin() {
  return useSyncExternalStore(
    () => () => {},
    () => window.location.origin,
    () => "",
  );
}

export function DashboardApp({ initial, orders, welcome }: { initial: Business; orders: Order[]; welcome: boolean }) {
  const router = useRouter();
  const [b, setB] = useState(initial);
  const [tab, setTab] = useState<Tab>(welcome ? "share" : "menu");
  const [save, setSave] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Item | null>(null);
  const [showWelcome, setShowWelcome] = useState(welcome);
  const lastSaved = useRef(JSON.stringify(initial));
  const origin = useOrigin();
  const menuUrl = `${origin}/m/${b.slug}`;

  // Autosave shortly after any change
  useEffect(() => {
    const snapshot = JSON.stringify(b);
    if (snapshot === lastSaved.current) return;
    setSave("saving");
    const t = setTimeout(async () => {
      try {
        const res = await fetch("/api/business", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(b),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Couldn’t save.");
        lastSaved.current = snapshot;
        setSave("saved");
        setSaveError(null);
      } catch (e) {
        setSave("error");
        setSaveError(e instanceof Error ? e.message : "Couldn’t save.");
      }
    }, 700);
    return () => clearTimeout(t);
  }, [b]);

  // Drop ?welcome=1 so a refresh doesn't show the banner again
  useEffect(() => {
    if (welcome) window.history.replaceState(null, "", "/dashboard");
  }, [welcome]);

  const update = (patch: Partial<Business>) => setB((p) => ({ ...p, ...patch }));
  const upsertItem = (item: Item) =>
    setB((p) => ({
      ...p,
      items: p.items.some((i) => i.id === item.id) ? p.items.map((i) => (i.id === item.id ? item : i)) : [...p.items, item],
    }));

  const tabs: { k: Tab; label: string; badge?: number }[] = [
    { k: "menu", label: "Menu" },
    { k: "orders", label: "Orders", badge: orders.length || undefined },
    { k: "share", label: "Link & QR" },
    { k: "settings", label: "Settings" },
  ];

  return (
    <div className="min-h-dvh bg-cream">
      <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Logo href="/dashboard" />
            <span className="hidden h-5 w-px bg-line-strong sm:block" />
            <span className="hidden truncate text-[14px] font-medium text-ink-2 sm:block">{b.name}</span>
          </div>
          <div className="flex items-center gap-3">
            <SaveIndicator state={save} />
            <a
              href={`/m/${b.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-line-strong bg-paper px-3 text-[13.5px] font-medium hover:border-ink"
            >
              View menu <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1100px] gap-1 overflow-x-auto px-3 md:px-6" aria-label="Dashboard sections">
          {tabs.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={cn(
                "flex shrink-0 items-center gap-1.5 border-b-2 px-2.5 pb-2.5 pt-1 text-[14px] font-medium",
                tab === t.k ? "border-orange text-ink" : "border-transparent text-muted hover:text-ink",
              )}
              aria-current={tab === t.k ? "page" : undefined}
            >
              {t.label}
              {t.badge ? <span className="rounded-full bg-orange px-1.5 text-[11px] font-semibold text-paper">{t.badge}</span> : null}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-[1100px] px-5 py-8 md:px-8 md:py-10">
        {saveError && (
          <p className="mb-6 rounded-sm bg-tomato-soft px-4 py-3 text-[14px] text-tomato" role="alert">
            {saveError}
          </p>
        )}

        {showWelcome && (
          <div className="mb-8 flex items-start justify-between gap-4 rounded-md bg-leaf px-5 py-4 text-paper">
            <div>
              <p className="font-display text-xl font-semibold tracking-tight">Your menu is live 🎉</p>
              <p className="mt-1 text-[14.5px] text-paper/85">
                Share the link or QR code below. Orders will arrive on WhatsApp at {formatPhone(b.whatsapp)}.
              </p>
            </div>
            <button onClick={() => setShowWelcome(false)} aria-label="Dismiss" className="text-paper/80 hover:text-paper">
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {tab === "menu" && <MenuEditor b={b} update={update} onEdit={setEditing} />}
        {tab === "orders" && <Orders orders={orders} onRefresh={() => router.refresh()} />}
        {tab === "share" && <Share b={b} menuUrl={menuUrl} />}
        {tab === "settings" && <Settings b={b} update={update} />}
      </main>

      <ItemEditor
        b={b}
        item={editing}
        onClose={() => setEditing(null)}
        onSave={(item) => {
          upsertItem(item);
          setEditing(null);
        }}
        onDelete={(id) => {
          setB((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));
          setEditing(null);
        }}
      />
    </div>
  );
}

function SaveIndicator({ state }: { state: SaveState }) {
  if (state === "idle") return null;
  return (
    <span className="hidden items-center gap-1.5 text-[12.5px] text-muted sm:inline-flex" role="status">
      {state === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
      {state === "saved" && <Check className="h-3.5 w-3.5 text-leaf" />}
      {state === "saving" ? "Saving…" : state === "saved" ? "Saved" : "Not saved"}
    </span>
  );
}

/* ---------------------------------------------------------------- Menu */

function MenuEditor({
  b,
  update,
  onEdit,
}: {
  b: Business;
  update: (p: Partial<Business>) => void;
  onEdit: (item: Item) => void;
}) {
  const [newCat, setNewCat] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const addCategory = () => {
    const name = newCat.trim();
    if (!name) return;
    update({ categories: [...b.categories, { id: uid(), name }] });
    setNewCat("");
  };
  const newItem = (categoryId: string): Item => ({
    id: uid(),
    categoryId,
    name: "",
    description: "",
    price: 0,
    photo: null,
    available: true,
    addOns: [],
  });
  const move = (idx: number, dir: -1 | 1) => {
    const cats = [...b.categories];
    const j = idx + dir;
    if (j < 0 || j >= cats.length) return;
    [cats[idx], cats[j]] = [cats[j], cats[idx]];
    update({ categories: cats });
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-bold leading-none tracking-[-0.035em]">Your menu</h1>
          <p className="mt-2 text-[15px] text-muted">
            {b.items.length} {b.items.length === 1 ? "item" : "items"} in {b.categories.length}{" "}
            {b.categories.length === 1 ? "category" : "categories"}. Changes go live as soon as they’re saved.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {b.categories.map((c, idx) => {
          const items = b.items.filter((i) => i.categoryId === c.id);
          return (
            <section key={c.id} className="overflow-hidden rounded-md border border-line bg-paper">
              <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
                <input
                  value={c.name}
                  onChange={(e) =>
                    update({ categories: b.categories.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)) })
                  }
                  className="min-w-0 flex-1 bg-transparent font-display text-[19px] font-semibold tracking-tight outline-none focus:underline focus:decoration-orange focus:underline-offset-4"
                  aria-label="Category name"
                />
                <div className="flex items-center gap-1 text-muted">
                  <button onClick={() => move(idx, -1)} disabled={idx === 0} className="h-8 rounded px-2 text-[12.5px] hover:bg-cream disabled:opacity-30" aria-label="Move category up">
                    ↑
                  </button>
                  <button onClick={() => move(idx, 1)} disabled={idx === b.categories.length - 1} className="h-8 rounded px-2 text-[12.5px] hover:bg-cream disabled:opacity-30" aria-label="Move category down">
                    ↓
                  </button>
                  {confirmDelete === c.id ? (
                    <span className="flex items-center gap-1 text-[12.5px]">
                      <button
                        onClick={() => {
                          update({
                            categories: b.categories.filter((x) => x.id !== c.id),
                            items: b.items.filter((i) => i.categoryId !== c.id),
                          });
                          setConfirmDelete(null);
                        }}
                        className="rounded bg-tomato px-2 py-1 font-medium text-paper"
                      >
                        Delete{items.length ? ` with ${items.length} items` : ""}
                      </button>
                      <button onClick={() => setConfirmDelete(null)} className="px-2 py-1">
                        Cancel
                      </button>
                    </span>
                  ) : (
                    <button onClick={() => setConfirmDelete(c.id)} className="grid h-8 w-8 place-items-center rounded hover:bg-cream hover:text-tomato" aria-label={`Delete ${c.name}`}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <ul className="divide-y divide-line">
                {items.map((item) => (
                  <li key={item.id} className="flex items-center gap-3 px-4 py-3">
                    {item.photo ? (
                      <Photo src={item.photo} alt="" className="h-12 w-12 shrink-0 rounded-[6px]" />
                    ) : (
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-[6px] bg-cream text-faint">
                        <ImagePlus className="h-4 w-4" />
                      </div>
                    )}
                    <button className="min-w-0 flex-1 text-left" onClick={() => onEdit(item)}>
                      <p className="truncate text-[14.5px] font-medium">{item.name}</p>
                      <p className="text-[13px] tabular-nums text-muted">
                        {naira(item.price)}
                        {item.addOns.length > 0 && ` · ${item.addOns.length} add-on${item.addOns.length > 1 ? "s" : ""}`}
                        {" · "}
                        <span className={item.available ? "text-leaf" : "text-tomato"}>{item.available ? "Available" : "Sold out"}</span>
                      </p>
                    </button>
                    <Toggle
                      checked={item.available}
                      onChange={(v) => update({ items: b.items.map((i) => (i.id === item.id ? { ...i, available: v } : i)) })}
                      label={`${item.name} available`}
                    />
                    <button onClick={() => onEdit(item)} className="grid h-9 w-9 place-items-center rounded text-muted hover:bg-cream hover:text-ink" aria-label={`Edit ${item.name}`}>
                      <Pencil className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onEdit(newItem(c.id))}
                className="flex w-full items-center gap-2 border-t border-line px-4 py-3 text-[14px] font-medium text-orange hover:bg-cream/60"
              >
                <Plus className="h-4 w-4" /> Add item to {c.name || "this category"}
              </button>
            </section>
          );
        })}
      </div>

      <form
        className="mt-6 flex flex-wrap gap-2 rounded-md border border-dashed border-line-strong p-4"
        onSubmit={(e) => {
          e.preventDefault();
          addCategory();
        }}
      >
        <input
          className={cn(inputClass, "h-11 min-w-[200px] flex-1")}
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
          placeholder="New category, e.g. Drinks"
          aria-label="New category name"
        />
        <Button type="submit" variant="dark">
          <Plus className="h-4 w-4" /> Add category
        </Button>
      </form>
    </div>
  );
}

/* ---------------------------------------------------------------- Item editor */

function ItemEditor({
  b,
  item,
  onClose,
  onSave,
  onDelete,
}: {
  b: Business;
  item: Item | null;
  onClose: () => void;
  onSave: (item: Item) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <Sheet open={!!item} onClose={onClose} label="Edit item">
      {item && <ItemForm key={item.id} b={b} item={item} onSave={onSave} onDelete={onDelete} />}
    </Sheet>
  );
}

function ItemForm({ b, item, onSave, onDelete }: { b: Business; item: Item; onSave: (i: Item) => void; onDelete: (id: string) => void }) {
  const [draft, setDraft] = useState<Item>(item);
  const [priceText, setPriceText] = useState(item.price ? String(item.price) : "");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const isNew = !b.items.some((i) => i.id === item.id);
  const set = <K extends keyof Item>(k: K, v: Item[K]) => setDraft((d) => ({ ...d, [k]: v }));

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        const price = Number(priceText.replace(/\D/g, ""));
        if (!draft.name.trim()) return setError("Give this item a name.");
        if (!(price > 0)) return setError("Add a price.");
        onSave({
          ...draft,
          name: draft.name.trim(),
          price,
          addOns: draft.addOns.filter((a) => a.name.trim()).map((a) => ({ ...a, name: a.name.trim() })),
        });
      }}
    >
      <div className="flex-1 overflow-y-auto px-5 pb-6 pt-5">
        <h2 className="font-display text-xl font-bold tracking-[-0.02em]">{isNew ? "Add item" : "Edit item"}</h2>

        <div className="mt-5 flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="relative grid h-24 w-24 shrink-0 place-items-center overflow-hidden rounded-sm border border-dashed border-line-strong bg-cream text-[12px] text-muted hover:border-ink"
          >
            {draft.photo ? (
              <Photo src={draft.photo} alt="" className="absolute inset-0 h-full w-full" />
            ) : uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="flex flex-col items-center gap-1">
                <ImagePlus className="h-5 w-5" /> Add photo
              </span>
            )}
          </button>
          <div className="text-[13px] text-muted">
            <p>A clear, well-lit photo sells best.</p>
            {draft.photo && (
              <button type="button" onClick={() => set("photo", null)} className="mt-1 font-medium text-tomato">
                Remove photo
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              e.target.value = "";
              if (!f) return;
              setUploading(true);
              try {
                set("photo", await compressImage(f, 900));
              } catch {
                setError("Couldn’t read that image. Try a JPG or PNG.");
              } finally {
                setUploading(false);
              }
            }}
          />
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_150px]">
          <label className="block">
            <span className="mb-1.5 block text-[13.5px] font-medium">Name</span>
            <input className={inputClass} value={draft.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Jollof rice & chicken" autoFocus={isNew} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13.5px] font-medium">Price</span>
            <div className="relative">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">₦</span>
              <input
                className={cn(inputClass, "pl-8 tabular-nums")}
                inputMode="numeric"
                value={priceText ? Number(priceText.replace(/\D/g, "")).toLocaleString("en-NG") : ""}
                onChange={(e) => setPriceText(e.target.value.replace(/\D/g, "").slice(0, 7))}
                placeholder="3,500"
              />
            </div>
          </label>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-[13.5px] font-medium">Description</span>
          <textarea
            className={cn(inputClass, "h-20 resize-none py-2.5 leading-relaxed")}
            maxLength={240}
            value={draft.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="What’s in it? How spicy? How many does it serve?"
          />
        </label>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13.5px] font-medium">Category</span>
            <select className={inputClass} value={draft.categoryId} onChange={(e) => set("categoryId", e.target.value)}>
              {b.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13.5px] font-medium">
              Label <span className="font-normal text-muted">Optional</span>
            </span>
            <input className={inputClass} value={draft.tag ?? ""} maxLength={20} onChange={(e) => set("tag", e.target.value)} placeholder="e.g. Spicy, Bestseller" />
          </label>
        </div>

        <div className="mt-4 flex items-center justify-between rounded-sm border border-line-strong px-4 py-3">
          <div>
            <p className="text-[14px] font-medium">Available</p>
            <p className="text-[12.5px] text-muted">Turn off when it sells out.</p>
          </div>
          <Toggle checked={draft.available} onChange={(v) => set("available", v)} label="Available" />
        </div>

        <div className="mt-6">
          <p className="text-[14px] font-semibold">Add-ons</p>
          <p className="text-[12.5px] text-muted">Extras customers can add, like plantain, extra protein or a drink.</p>
          <ul className="mt-3 space-y-2">
            {draft.addOns.map((a, i) => (
              <li key={a.id} className="flex gap-2">
                <input
                  className={cn(inputClass, "h-11 flex-1")}
                  value={a.name}
                  placeholder="Extra plantain"
                  onChange={(e) => set("addOns", draft.addOns.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
                  aria-label="Add-on name"
                />
                <div className="relative w-28">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[14px] text-muted">₦</span>
                  <input
                    className={cn(inputClass, "h-11 pl-7 tabular-nums")}
                    inputMode="numeric"
                    value={a.price ? a.price.toLocaleString("en-NG") : ""}
                    placeholder="500"
                    onChange={(e) =>
                      set("addOns", draft.addOns.map((x, j) => (j === i ? { ...x, price: Number(e.target.value.replace(/\D/g, "").slice(0, 6)) } : x)))
                    }
                    aria-label="Add-on price"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => set("addOns", draft.addOns.filter((_, j) => j !== i))}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-sm text-muted hover:bg-cream hover:text-tomato"
                  aria-label="Remove add-on"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => set("addOns", [...draft.addOns, { id: uid(), name: "", price: 0 }])}
            className="mt-2 inline-flex items-center gap-1.5 text-[14px] font-medium text-orange"
          >
            <Plus className="h-4 w-4" /> Add an add-on
          </button>
        </div>

        {error && (
          <p className="mt-5 rounded-sm bg-tomato-soft px-3.5 py-2.5 text-[13.5px] text-tomato" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-line px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-4">
        {!isNew ? (
          <button type="button" onClick={() => onDelete(item.id)} className="inline-flex items-center gap-1.5 text-[14px] font-medium text-tomato">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        ) : (
          <span />
        )}
        <Button type="submit" size="lg">
          {isNew ? "Add item" : "Save item"}
        </Button>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- Orders */

function Orders({ orders, onRefresh }: { orders: Order[]; onRefresh: () => void }) {
  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[32px] font-bold leading-none tracking-[-0.035em]">Orders</h1>
          <p className="mt-2 max-w-[36rem] text-[15px] text-muted">
            Every checkout is recorded here and sent to your WhatsApp. Confirm the order and payment with the customer
            in the chat.
          </p>
        </div>
        <Button variant="outline" onClick={onRefresh}>
          <RefreshCw className="h-4 w-4" /> Refresh
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8 rounded-md border border-dashed border-line-strong bg-paper px-6 py-14 text-center">
          <MessageCircle className="mx-auto h-8 w-8 text-faint" />
          <p className="mt-3 font-display text-lg font-semibold">No orders yet</p>
          <p className="mt-1 text-[14px] text-muted">Share your menu link — orders will show up here and on WhatsApp.</p>
        </div>
      ) : (
        <ul className="mt-8 space-y-3">
          {orders.map((o) => (
            <li key={o.id} className="rounded-md border border-line bg-paper p-4 md:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">
                  #{o.id} · {o.customer.name}
                  <span
                    className={cn(
                      "ml-2 rounded-[4px] px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
                      o.customer.mode === "delivery" ? "bg-gold-soft text-[#8a5a0b]" : "bg-leaf-soft text-leaf",
                    )}
                  >
                    {o.customer.mode}
                  </span>
                </p>
                <p className="text-[13px] text-muted">
                  {new Date(o.createdAt).toLocaleString("en-NG", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                </p>
              </div>
              <ul className="mt-3 space-y-1 text-[14px]">
                {o.lines.map((l, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span>
                      {l.qty}× {l.name}
                      {l.addOns.length > 0 && <span className="text-muted"> + {l.addOns.map((a) => a.name).join(", ")}</span>}
                      {l.note && <span className="italic text-muted"> — “{l.note}”</span>}
                    </span>
                    <span className="tabular-nums">{naira(l.lineTotal)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t border-dashed border-line-strong pt-3 text-[13.5px]">
                <div className="space-y-0.5 text-ink-2">
                  <p>{o.customer.phone}</p>
                  {o.customer.address && <p>{o.customer.address}</p>}
                  {o.customer.note && <p className="text-muted">Note: {o.customer.note}</p>}
                </div>
                <div className="flex items-center gap-3">
                  {toWhatsAppNumber(o.customer.phone) && (
                    <a
                      href={`https://wa.me/${toWhatsAppNumber(o.customer.phone)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 font-medium text-leaf"
                    >
                      <MessageCircle className="h-4 w-4" /> Chat
                    </a>
                  )}
                  <p className="font-display text-lg font-bold tabular-nums">{naira(o.total)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- Share */

function Share({ b, menuUrl }: { b: Business; menuUrl: string }) {
  const [copied, setCopied] = useState(false);
  const display = menuUrl.replace(/^https?:\/\//, "");
  const isLocal = /localhost|127\.0\.0\.1/.test(menuUrl);

  const downloadQr = async () => {
    const dataUrl = await QRCode.toDataURL(menuUrl, { width: 1200, margin: 2, color: { dark: "#1d1a16", light: "#ffffff" } });
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${b.slug}-menu-qr.png`;
    a.click();
  };

  const shareText = `Hi! You can now see our menu and order from ${b.name} here: ${menuUrl}`;

  return (
    <div>
      <h1 className="font-display text-[32px] font-bold leading-none tracking-[-0.035em]">Link &amp; QR code</h1>
      <p className="mt-2 text-[15px] text-muted">Send this link to customers, or print the QR code for tables, counters and packaging.</p>

      {isLocal && (
        <p className="mt-5 rounded-sm bg-gold-soft px-4 py-3 text-[13.5px] text-ink-2">
          You’re running Menuly on your computer, so this link only works on this computer. To test on your phone, open
          the site using your computer’s network address (shown as “Network” when you run <code>npm run dev</code>). Once
          Menuly is online, this becomes your public link.
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-md border border-line bg-paper p-5 md:p-6">
          <p className="text-[13px] font-medium text-muted">Your menu link</p>
          <p className="mt-1 break-all font-display text-[22px] font-semibold tracking-[-0.02em] md:text-[26px]">{display || `…/m/${b.slug}`}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                navigator.clipboard?.writeText(menuUrl).catch(() => {});
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              }}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy link"}
            </Button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-sm bg-leaf px-5 text-[15px] font-medium text-paper hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" /> Share on WhatsApp
            </a>
            <Link href={`/m/${b.slug}`} target="_blank" className="inline-flex h-11 items-center gap-2 rounded-sm px-4 text-[15px] font-medium shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:shadow-[inset_0_0_0_1px_var(--color-ink)]">
              Open menu <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 border-t border-line pt-5">
            <p className="text-[14px] font-semibold">Where to put it</p>
            <ul className="mt-2 grid gap-x-6 gap-y-1.5 text-[14px] text-ink-2 sm:grid-cols-2">
              <li>· Instagram & TikTok bio</li>
              <li>· WhatsApp status and broadcast lists</li>
              <li>· Your Google Business Profile</li>
              <li>· Replies when customers ask “what’s available?”</li>
            </ul>
          </div>
        </div>

        <div className="rounded-md border border-line bg-paper p-5 text-center md:p-6">
          <div className="mx-auto w-full max-w-[240px] border border-line bg-white p-4">
            {menuUrl && <QrCode value={menuUrl} className="w-full" accent={b.accent} />}
          </div>
          <p className="mt-3 text-[13px] text-muted">Scan to open {b.name}</p>
          <Button variant="dark" className="mt-4 w-full" onClick={downloadQr}>
            <Download className="h-4 w-4" /> Download QR (PNG)
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Settings */

const COLORS = ["#e2602a", "#b8402e", "#3e6a47", "#e3a92f", "#1d1a16", "#2f5d8a", "#7a3b69"];

function Settings({ b, update }: { b: Business; update: (p: Partial<Business>) => void }) {
  const [wa, setWa] = useState(b.whatsapp.startsWith("234") ? "0" + b.whatsapp.slice(3) : b.whatsapp);
  const waValid = toWhatsAppNumber(wa);
  const logoRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  return (
    <div className="max-w-[640px]">
      <h1 className="font-display text-[32px] font-bold leading-none tracking-[-0.035em]">Settings</h1>
      <p className="mt-2 text-[15px] text-muted">Your business details, ordering options and branding.</p>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-1.5 block text-[13.5px] font-medium">Business name</span>
          <input className={inputClass} value={b.name} onChange={(e) => update({ name: e.target.value })} />
          <span className="mt-1 block text-[12.5px] text-muted">Your link stays the same: /m/{b.slug}</span>
        </label>

        <label className="block">
          <span className="mb-1.5 block text-[13.5px] font-medium">WhatsApp number for orders</span>
          <input
            className={inputClass}
            value={wa}
            inputMode="tel"
            onChange={(e) => {
              setWa(e.target.value);
              const n = toWhatsAppNumber(e.target.value);
              if (n) update({ whatsapp: n });
            }}
            aria-invalid={!waValid}
          />
          <span className={cn("mt-1 block text-[12.5px]", waValid ? "text-leaf" : "text-tomato")}>
            {waValid ? `Orders open a chat with ${formatPhone(waValid)}` : "Enter a valid number — orders still go to the last valid one."}
          </span>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[13.5px] font-medium">Area or address</span>
            <input className={inputClass} value={b.area} onChange={(e) => update({ area: e.target.value })} placeholder="e.g. Wuse 2, Abuja" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-[13.5px] font-medium">Status line</span>
            <input className={inputClass} value={b.hours} maxLength={60} onChange={(e) => update({ hours: e.target.value })} placeholder="Open · closes 10pm" />
          </label>
        </div>

        <fieldset>
          <legend className="mb-2 text-[13.5px] font-medium">Ordering options</legend>
          <div className="flex flex-wrap gap-2">
            {([
              ["pickup", "Pickup"],
              ["delivery", "Delivery"],
            ] as const).map(([k, label]) => (
              <label key={k} className={cn("flex cursor-pointer items-center gap-2.5 rounded-sm border px-3.5 py-2.5 text-[14px] font-medium", b[k] ? "border-ink bg-paper" : "border-line-strong")}>
                <input
                  type="checkbox"
                  checked={b[k]}
                  onChange={(e) => {
                    const next = { ...b, [k]: e.target.checked };
                    if (!next.pickup && !next.delivery) return;
                    update({ [k]: e.target.checked });
                  }}
                  className="h-4 w-4 accent-[var(--color-orange)]"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <p className="mb-2 text-[13.5px] font-medium">Brand colour</p>
          <div className="flex flex-wrap items-center gap-2.5">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => update({ accent: c })}
                className={cn("grid h-10 w-10 place-items-center rounded-full ring-offset-2 ring-offset-cream", b.accent === c && "ring-2 ring-ink")}
                style={{ background: c }}
                aria-label={`Use colour ${c}`}
                aria-pressed={b.accent === c}
              >
                {b.accent === c && <Check className="h-4 w-4 text-paper" strokeWidth={3} />}
              </button>
            ))}
            <label className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-dashed border-line-strong text-muted" title="Custom colour">
              +
              <input type="color" value={b.accent} onChange={(e) => update({ accent: e.target.value })} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Custom colour" />
            </label>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-[auto_1fr]">
          <div>
            <p className="mb-2 text-[13.5px] font-medium">Logo</p>
            <button type="button" onClick={() => logoRef.current?.click()} className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-sm border border-dashed border-line-strong bg-paper text-[12px] text-muted hover:border-ink">
              {b.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.logo} alt="" className="absolute inset-0 h-full w-full object-cover" />
              ) : (
                "Upload"
              )}
            </button>
            {b.logo && (
              <button type="button" onClick={() => update({ logo: null })} className="mt-1 text-[12.5px] text-tomato">
                Remove
              </button>
            )}
            <input
              ref={logoRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) update({ logo: await compressImage(f, 320, "logo") });
              }}
            />
          </div>
          <div>
            <p className="mb-2 text-[13.5px] font-medium">Cover image</p>
            <button type="button" onClick={() => coverRef.current?.click()} className="relative grid h-24 w-full place-items-center overflow-hidden rounded-sm border border-dashed border-line-strong bg-paper text-[12px] text-muted hover:border-ink">
              {b.cover ? <Photo src={b.cover} alt="" className="absolute inset-0 h-full w-full" tone="deep" /> : "Upload a wide photo"}
            </button>
            <input
              ref={coverRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) update({ cover: await compressImage(f, 1400) });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
