import type { AddOn, Business, Category, Item } from "./types";
import { toWhatsAppNumber, uid } from "./format";

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const bool = (v: unknown, d: boolean) => (typeof v === "boolean" ? v : d);
const num = (v: unknown) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : 0;
};
const MAX_IMAGE = 1_500_000; // ~1.5 MB per image (data URLs)

function image(v: unknown): string | null {
  if (typeof v !== "string" || !v) return null;
  if (v.startsWith("data:image/")) return v.length <= MAX_IMAGE ? v : null;
  if (v.startsWith("https://") || v.startsWith("/")) return v.slice(0, 1000);
  return null;
}

const color = (v: unknown) => (typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v) ? v : "#e2602a");
const id = (v: unknown) => (typeof v === "string" && /^[a-z0-9-]{1,40}$/i.test(v) ? v : uid());

export type BusinessInput = Omit<Business, "slug" | "createdAt" | "updatedAt">;

/** Clean anything the browser sends before it touches the data store. */
export function sanitizeBusiness(raw: Record<string, unknown>): { data?: BusinessInput; error?: string } {
  const name = str(raw.name, 80);
  if (name.length < 2) return { error: "Business name is required." };
  const whatsapp = toWhatsAppNumber(str(raw.whatsapp, 30));
  if (!whatsapp) return { error: "Enter a valid WhatsApp number." };

  const categories: Category[] = (Array.isArray(raw.categories) ? raw.categories : [])
    .slice(0, 40)
    .map((c: Record<string, unknown>) => ({ id: id(c?.id), name: str(c?.name, 40) }))
    .filter((c) => c.name);

  const catIds = new Set(categories.map((c) => c.id));
  const items: Item[] = (Array.isArray(raw.items) ? raw.items : [])
    .slice(0, 300)
    .map((it: Record<string, unknown>) => ({
      id: id(it?.id),
      categoryId: typeof it?.categoryId === "string" ? it.categoryId : "",
      name: str(it?.name, 80),
      description: str(it?.description, 240),
      price: num(it?.price),
      photo: image(it?.photo),
      available: bool(it?.available, true),
      tag: str(it?.tag, 20) || undefined,
      addOns: (Array.isArray(it?.addOns) ? it.addOns : [])
        .slice(0, 20)
        .map((a: Record<string, unknown>): AddOn => ({ id: id(a?.id), name: str(a?.name, 50), price: num(a?.price) }))
        .filter((a: AddOn) => a.name),
    }))
    .filter((it) => it.name && catIds.has(it.categoryId));

  const pickup = bool(raw.pickup, true);
  const delivery = bool(raw.delivery, true);

  return {
    data: {
      name,
      type: str(raw.type, 40) || "Restaurant",
      area: str(raw.area, 120),
      whatsapp,
      logo: image(raw.logo),
      cover: image(raw.cover),
      accent: color(raw.accent),
      hours: str(raw.hours, 60) || "Open now",
      pickup: pickup || !delivery, // at least one option
      delivery,
      categories,
      items,
    },
  };
}
