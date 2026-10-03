import { Clock, ImagePlus, MapPin, MessageCircle, Minus, Plus, Search, Check, ChevronLeft, Bike, Store } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import {
  categories as demoCategories,
  demoBusiness,
  menuItems,
  naira,
  type MenuItem,
} from "@/lib/menu-data";
import { photos } from "@/lib/images";

export type BusinessBrand = {
  name: string;
  area?: string;
  status?: string;
  accent?: string;
  logoUrl?: string | null;
  coverUrl?: string | null;
};

const defaultBrand: Required<Omit<BusinessBrand, "logoUrl">> & { logoUrl: string | null } = {
  name: demoBusiness.name,
  area: demoBusiness.area,
  status: demoBusiness.hours,
  accent: "#e2602a",
  logoUrl: null,
  coverUrl: photos.cover,
};

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "M"
  );
}

/* ---------------------------------------------------------------
   Menu home: cover, business info, categories, items, cart bar
---------------------------------------------------------------- */
export function MenuHomeScreen({
  brand: brandIn,
  categories = demoCategories,
  items = menuItems.slice(0, 5),
  activeCategory = 0,
  cart = { count: 2, total: 9300 },
  showCart = true,
  ghostRows = 0,
}: {
  brand?: BusinessBrand;
  categories?: string[];
  items?: Pick<MenuItem, "id" | "name" | "description" | "price" | "photo" | "available" | "tag">[];
  activeCategory?: number;
  cart?: { count: number; total: number } | null;
  showCart?: boolean;
  /** Placeholder rows shown under real items (used in onboarding). */
  ghostRows?: number;
}) {
  const brand = { ...defaultBrand, ...Object.fromEntries(Object.entries(brandIn ?? {}).filter(([, v]) => v !== undefined && v !== "")) };
  const accent = brand.accent;

  return (
    <div className="relative h-full overflow-hidden text-ink">
      <div className="no-scrollbar h-full overflow-y-auto pb-24">
        {/* Cover */}
        <div className="relative h-[132px] bg-cream-2">
          {brand.coverUrl ? (
            <Photo src={brand.coverUrl} alt="" className="h-full w-full" tone="deep" />
          ) : (
            <div className="h-full w-full" style={{ background: `linear-gradient(135deg, ${accent}, #1d1a16)` }} />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
        </div>

        {/* Identity */}
        <div className="relative px-4">
          <div
            className="-mt-7 grid h-14 w-14 place-items-center overflow-hidden rounded-[14px] border-[3px] border-paper text-lg font-bold text-paper shadow-card"
            style={{ background: accent }}
          >
            {brand.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={brand.logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="font-display">{initials(brand.name)}</span>
            )}
          </div>
          <h3 className="mt-2 font-display text-[21px] font-bold leading-tight tracking-[-0.03em]">
            {brand.name}
          </h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1.5 font-medium text-leaf">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" />
              {brand.status}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {brand.area}
            </span>
          </div>

          <div className="mt-3 flex h-9 items-center gap-2 rounded-[10px] bg-cream px-3 text-[12px] text-faint">
            <Search className="h-3.5 w-3.5" /> Search the menu
          </div>
        </div>

        {/* Categories */}
        <div className="no-scrollbar sticky top-0 z-10 mt-3 flex gap-4 overflow-x-auto border-b border-line bg-paper/95 px-4 pt-2 text-[12.5px] backdrop-blur">
          {categories.map((c, i) => (
            <span
              key={c + i}
              className={cn(
                "shrink-0 border-b-2 pb-2 font-medium",
                i === activeCategory ? "text-ink" : "border-transparent text-muted",
              )}
              style={i === activeCategory ? { borderColor: accent } : undefined}
            >
              {c}
            </span>
          ))}
        </div>

        {/* Items */}
        <ul className="divide-y divide-line px-4">
          {items.map((item) => (
            <li key={item.id} className={cn("flex gap-3 py-3.5", !item.available && "opacity-55")}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-[13.5px] font-semibold leading-snug">{item.name}</p>
                </div>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-[1.45] text-muted">
                  {item.description}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <span className="text-[13px] font-semibold tabular-nums">{item.price > 0 ? naira(item.price) : "₦ —"}</span>
                  {item.available ? (
                    item.tag && (
                      <span
                        className="rounded-[3px] px-1 py-px text-[9.5px] font-semibold uppercase tracking-wide"
                        style={{ color: accent, background: `${accent}1f` }}
                      >
                        {item.tag}
                      </span>
                    )
                  ) : (
                    <span className="text-[10px] font-medium text-tomato">Sold out today</span>
                  )}
                </div>
              </div>
              <div className="relative h-[76px] w-[76px] shrink-0">
                {item.photo ? (
                  <Photo src={item.photo} alt={item.name} className="h-full w-full rounded-[10px]" />
                ) : (
                  <div className="grid h-full w-full place-items-center rounded-[10px] border border-dashed border-line-strong bg-cream text-faint">
                    <ImagePlus className="h-5 w-5" />
                  </div>
                )}
                {item.available && (
                  <span
                    className="absolute -bottom-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-full border-2 border-paper text-paper shadow-card"
                    style={{ background: accent }}
                  >
                    <Plus className="h-3.5 w-3.5" strokeWidth={2.75} />
                  </span>
                )}
              </div>
            </li>
          ))}
          {Array.from({ length: ghostRows }).map((_, i) => (
            <li key={`ghost-${i}`} className="flex gap-3 py-3.5" aria-hidden>
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-2.5 w-2/3 rounded-full bg-cream-2" />
                <div className="h-2 w-full rounded-full bg-cream" />
                <div className="h-2 w-1/3 rounded-full bg-cream" />
              </div>
              <div className="h-[76px] w-[76px] rounded-[10px] border border-dashed border-line" />
            </li>
          ))}
        </ul>
      </div>

      {showCart && cart && cart.count > 0 && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-paper via-paper/90 to-transparent" />
      )}
      {showCart && cart && cart.count > 0 && (
        <div className="absolute inset-x-3 bottom-4 z-20 flex h-12 items-center justify-between rounded-[14px] bg-ink px-4 text-paper shadow-lift">
          <span className="flex items-center gap-2 text-[12.5px] font-medium">
            <span className="grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold" style={{ background: accent }}>
              {cart.count}
            </span>
            View order
          </span>
          <span className="text-[13px] font-semibold tabular-nums">{naira(cart.total)}</span>
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   Item detail with add-ons + quantity
---------------------------------------------------------------- */
export function MenuItemScreen({ item = menuItems[0], accent = "#e2602a" }: { item?: MenuItem; accent?: string }) {
  const selected = new Set([0, 2]);
  const addOnTotal = (item.addOns ?? []).reduce((s, a, i) => (selected.has(i) ? s + a.price : s), 0);
  return (
    <div className="relative flex h-full flex-col text-ink">
      <div className="relative h-[230px] shrink-0">
        <Photo src={item.photo} alt={item.name} className="h-full w-full" priority />
        <span className="absolute left-3 top-11 grid h-8 w-8 place-items-center rounded-full bg-paper/90 shadow-card">
          <ChevronLeft className="h-4 w-4" />
        </span>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-24 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[20px] font-bold leading-[1.1] tracking-[-0.03em]">{item.name}</h3>
          <span className="pt-0.5 text-[14px] font-semibold tabular-nums">{naira(item.price)}</span>
        </div>
        <p className="mt-1.5 text-[11.5px] leading-[1.5] text-muted">{item.description}</p>
        <div className="mt-2 inline-flex items-center gap-1.5 text-[10.5px] font-medium text-leaf">
          <Clock className="h-3 w-3" /> Ready in about 20 min
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-line pt-3">
          <p className="text-[12.5px] font-semibold">Add-ons</p>
          <p className="text-[10.5px] text-faint">Optional</p>
        </div>
        <ul className="mt-1">
          {(item.addOns ?? []).map((a, i) => (
            <li key={a.name} className="flex items-center gap-3 py-2 text-[12px]">
              <span
                className={cn(
                  "grid h-[18px] w-[18px] place-items-center rounded-[5px] border",
                  selected.has(i) ? "border-transparent text-paper" : "border-line-strong",
                )}
                style={selected.has(i) ? { background: accent } : undefined}
              >
                {selected.has(i) && <Check className="h-3 w-3" strokeWidth={3} />}
              </span>
              <span className="flex-1">{a.name}</span>
              <span className="tabular-nums text-muted">+{naira(a.price)}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-2.5 border-t border-line bg-paper px-3 pb-5 pt-3">
        <div className="flex h-11 items-center gap-2.5 rounded-[12px] bg-cream px-2.5 text-[13px] font-semibold">
          <Minus className="h-3.5 w-3.5 text-muted" />1<Plus className="h-3.5 w-3.5" />
        </div>
        <div
          className="flex h-11 flex-1 items-center justify-between gap-2 whitespace-nowrap rounded-[12px] px-3 text-[12.5px] font-semibold text-paper"
          style={{ background: accent }}
        >
          <span>Add to order</span>
          <span className="tabular-nums">{naira(item.price + addOnTotal)}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   Checkout
---------------------------------------------------------------- */
export function MenuCheckoutScreen() {
  const lines = [
    { name: "Party Jollof & Chicken", note: "Extra plantain, Moi moi", qty: 1, price: 6000 },
    { name: "House Chapman", note: "", qty: 2, price: 4000 },
  ];
  const subtotal = lines.reduce((s, l) => s + l.price, 0);
  return (
    <div className="relative flex h-full flex-col bg-paper pt-11 text-ink">
      <div className="flex items-center gap-2 px-4 pb-3">
        <ChevronLeft className="h-4 w-4" />
        <p className="font-display text-[17px] font-bold tracking-[-0.02em]">Your order</p>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-28">
        <div className="grid grid-cols-2 gap-1 rounded-[12px] bg-cream p-1 text-[12px] font-medium">
          <span className="flex items-center justify-center gap-1.5 rounded-[9px] bg-paper py-2 shadow-card">
            <Store className="h-3.5 w-3.5" /> Pickup
          </span>
          <span className="flex items-center justify-center gap-1.5 py-2 text-muted">
            <Bike className="h-3.5 w-3.5" /> Delivery
          </span>
        </div>

        <ul className="mt-3 divide-y divide-line">
          {lines.map((l) => (
            <li key={l.name} className="flex gap-3 py-3 text-[12px]">
              <span className="font-semibold tabular-nums text-muted">{l.qty}×</span>
              <span className="flex-1">
                <span className="block font-medium">{l.name}</span>
                {l.note && <span className="text-[11px] text-muted">{l.note}</span>}
              </span>
              <span className="font-medium tabular-nums">{naira(l.price)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-1 space-y-1.5 border-t border-dashed border-line-strong pt-3 text-[11.5px]">
          <div className="flex justify-between text-muted">
            <span>Subtotal</span>
            <span className="tabular-nums">{naira(subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Packaging</span>
            <span className="tabular-nums">{naira(300)}</span>
          </div>
          <div className="flex justify-between pt-1 text-[13px] font-semibold">
            <span>Total</span>
            <span className="tabular-nums">{naira(subtotal + 300)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <p className="text-[12px] font-semibold">Your details</p>
          <div className="rounded-[10px] border border-line px-3 py-2">
            <p className="text-[9.5px] uppercase tracking-wider text-faint">Name</p>
            <p className="text-[12px]">Adaeze O.</p>
          </div>
          <div className="rounded-[10px] border border-line px-3 py-2">
            <p className="text-[9.5px] uppercase tracking-wider text-faint">Phone</p>
            <p className="text-[12px] tabular-nums">0803 000 0000</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 border-t border-line bg-paper px-3 pb-5 pt-3">
        <div className="flex h-11 items-center justify-center gap-2 rounded-[12px] bg-leaf text-[12.5px] font-semibold text-paper">
          <MessageCircle className="h-4 w-4" /> Send order on WhatsApp · {naira(subtotal + 300)}
        </div>
      </div>
    </div>
  );
}
