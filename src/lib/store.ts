import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Business, Order } from "./types";
import { slugify } from "./format";
import { demoBusiness, menuItems } from "./menu-data";
import { photos } from "./images";

/**
 * A tiny JSON-file data store so the whole flow works end to end locally.
 *
 * Data lives in `.data/menuly.json` in the project folder. This is fine for
 * development and for running on a single server you control. Before launching
 * on serverless hosting (e.g. Vercel), replace these functions with a real
 * database (Supabase, Postgres, Firebase…). Nothing else in the app touches
 * the file directly, so this is the only file that needs to change.
 */

type DB = { businesses: Record<string, Business>; orders: Order[] };

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "menuly.json");
const MAX_ORDERS_PER_BUSINESS = 300;

let queue: Promise<unknown> = Promise.resolve();
/** Serialise writes so two requests can't clobber each other. */
function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => {});
  return run;
}

async function readDB(): Promise<DB> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const db = JSON.parse(raw) as DB;
    db.businesses ??= {};
    db.orders ??= [];
    return db;
  } catch {
    return { businesses: {}, orders: [] };
  }
}

async function writeDB(db: DB) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = DATA_FILE + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(db), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

/* ---------------- Demo menu (always available at /m/ofada-house) ---------------- */

function demo(): Business {
  const names = Array.from(new Set(menuItems.map((m) => m.category)));
  const categories = names.map((n) => ({ id: slugify(n), name: n }));
  const now = new Date(0).toISOString();
  return {
    slug: demoBusiness.slug,
    name: demoBusiness.name,
    type: "Restaurant",
    area: demoBusiness.area,
    whatsapp: "2348000000000",
    logo: null,
    cover: photos.cover,
    accent: "#e2602a",
    hours: demoBusiness.hours,
    pickup: true,
    delivery: true,
    demo: true,
    categories,
    items: menuItems.map((m) => ({
      id: m.id,
      categoryId: slugify(m.category),
      name: m.name,
      description: m.description,
      price: m.price,
      photo: m.photo,
      available: m.available,
      tag: m.tag,
      addOns: (m.addOns ?? []).map((a) => ({ id: slugify(a.name), name: a.name, price: a.price })),
    })),
    createdAt: now,
    updatedAt: now,
  };
}

/* ---------------- Businesses ---------------- */

export async function getBusiness(slug: string): Promise<Business | null> {
  const db = await readDB();
  if (db.businesses[slug]) return db.businesses[slug];
  if (slug === demoBusiness.slug) return demo();
  return null;
}

/** Create a business, picking a free slug based on its name. */
export function createBusiness(input: Omit<Business, "slug" | "createdAt" | "updatedAt">) {
  return withLock(async () => {
    const db = await readDB();
    const base = slugify(input.name);
    let slug = base;
    let n = 2;
    while (db.businesses[slug] || slug === demoBusiness.slug || RESERVED.has(slug)) {
      slug = `${base}-${n++}`;
    }
    const now = new Date().toISOString();
    const business: Business = { ...input, slug, demo: false, createdAt: now, updatedAt: now };
    db.businesses[slug] = business;
    await writeDB(db);
    return business;
  });
}

export function updateBusiness(slug: string, patch: Partial<Business>) {
  return withLock(async () => {
    const db = await readDB();
    const current = db.businesses[slug];
    if (!current) return null;
    const next: Business = {
      ...current,
      ...patch,
      slug: current.slug,
      createdAt: current.createdAt,
      demo: false,
      updatedAt: new Date().toISOString(),
    };
    db.businesses[slug] = next;
    await writeDB(db);
    return next;
  });
}

const RESERVED = new Set(["admin", "api", "dashboard", "login", "signup", "m", "app", "menuly"]);

/* ---------------- Orders ---------------- */

export function saveOrder(order: Order) {
  return withLock(async () => {
    const db = await readDB();
    db.orders.unshift(order);
    // keep the file small: cap orders per business
    const counts: Record<string, number> = {};
    db.orders = db.orders.filter((o) => (counts[o.slug] = (counts[o.slug] ?? 0) + 1) <= MAX_ORDERS_PER_BUSINESS);
    await writeDB(db);
    return order;
  });
}

export async function getOrders(slug: string, limit = 50) {
  const db = await readDB();
  return db.orders.filter((o) => o.slug === slug).slice(0, limit);
}
