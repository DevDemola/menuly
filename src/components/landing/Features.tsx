import { Check, GripVertical, Plus } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { photos } from "@/lib/images";
import { naira } from "@/lib/menu-data";
import { cn } from "@/lib/cn";

function FeatureText({
  n,
  title,
  children,
  className,
}: {
  n?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {n && <p className="font-display text-sm font-semibold tabular-nums text-orange">{n}</p>}
      <h3 className="mt-2 font-display first:mt-0 text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[34px]">
        {title}
      </h3>
      <div className="mt-3 text-[16px] leading-relaxed text-ink-2">{children}</div>
    </div>
  );
}

const swatches = [
  { c: "#e2602a", n: "Pepper" },
  { c: "#b8402e", n: "Zobo" },
  { c: "#3e6a47", n: "Ugu" },
  { c: "#e3a92f", n: "Garri" },
  { c: "#1d1a16", n: "Charcoal" },
];

function MenuEditor() {
  const cats = ["Rice", "Grills", "Small chops", "Soups", "Drinks"];
  return (
    <div className="overflow-hidden rounded-[10px] border border-line-strong/70 bg-paper shadow-lift">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <p className="text-[13px] font-semibold">Menu editor</p>
        <span className="rounded-[5px] bg-leaf-soft px-2 py-0.5 text-[11px] font-semibold text-leaf">Saved · live</span>
      </div>
      <div className="grid sm:grid-cols-[170px_1fr]">
        <ul className="border-b border-line p-2 text-[13px] sm:border-b-0 sm:border-r">
          {cats.map((c, i) => (
            <li
              key={c}
              className={cn(
                "flex items-center gap-1.5 rounded-[5px] px-2 py-2",
                i === 0 ? "bg-cream font-semibold" : "text-ink-2",
              )}
            >
              <GripVertical className="h-3.5 w-3.5 text-faint" />
              {c}
              <span className="ml-auto text-[11px] tabular-nums text-faint">{[6, 4, 5, 3, 7][i]}</span>
            </li>
          ))}
          <li className="flex items-center gap-1.5 px-2 py-2 text-orange">
            <Plus className="h-3.5 w-3.5" /> Add category
          </li>
        </ul>
        <div className="p-4">
          <div className="flex gap-3">
            <Photo src={photos.jollof} alt="" className="h-16 w-16 shrink-0 rounded-[6px]" />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold">Party Jollof & Chicken</p>
              <p className="text-[12.5px] tabular-nums text-muted">{naira(4500)}</p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-[12px] font-medium text-leaf">
                <span className="relative inline-block h-[16px] w-[28px] rounded-full bg-leaf">
                  <span className="absolute right-[2px] top-[2px] h-3 w-3 rounded-full bg-paper" />
                </span>
                Available today
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[6px] border border-line">
            <div className="flex items-center justify-between border-b border-line px-3 py-2 text-[12px]">
              <span className="font-semibold">Add-ons · Extras</span>
              <span className="text-muted">Pick up to 3</span>
            </div>
            {[
              ["Extra plantain", 800],
              ["Peppered turkey", 2500],
              ["Moi moi", 700],
            ].map(([n, p]) => (
              <div key={n as string} className="flex items-center justify-between px-3 py-2 text-[12.5px]">
                <span>{n}</span>
                <span className="tabular-nums text-muted">+{naira(p as number)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Tickets() {
  const tickets = [
    { id: "#1043", time: "1:12 pm", lines: ["1× Ofada Rice & Ayamase", "1× Zobo (50cl)"], type: "Delivery · Ikate", status: "New", tone: "bg-orange text-paper" },
    { id: "#1042", time: "1:04 pm", lines: ["1× Party Jollof & Chicken", "   + Extra plantain", "2× House Chapman"], type: "Pickup · Adaeze O.", status: "Preparing", tone: "bg-gold text-ink" },
  ];
  return (
    <div className="relative mx-auto flex max-w-[460px] items-start justify-center sm:gap-4">
      {tickets.map((t, i) => (
        <div
          key={t.id}
          className={cn(
            "drop-shadow-[0_18px_22px_rgba(29,26,22,0.22)]",
            i === 0 ? "-rotate-2" : "-ml-14 mt-10 rotate-2 sm:ml-0",
          )}
        >
        <div
          className="relative w-[200px] bg-paper px-4 pb-6 pt-4 font-mono text-[12px] text-ink"
          style={{
            maskImage: "radial-gradient(circle at 6px 100%, transparent 5px, #000 5.5px)",
            maskSize: "12px 100%",
            maskRepeat: "repeat-x",
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-bold">{t.id}</span>
            <span className="text-muted">{t.time}</span>
          </div>
          <span className={cn("mt-2 inline-block rounded-[3px] px-1.5 py-0.5 font-sans text-[10.5px] font-semibold", t.tone)}>
            {t.status}
          </span>
          <div className="my-3 border-t border-dashed border-line-strong" />
          {t.lines.map((l) => (
            <p key={l} className="whitespace-pre">{l}</p>
          ))}
          <div className="my-3 border-t border-dashed border-line-strong" />
          <p className="text-muted">{t.type}</p>
        </div>
        </div>
      ))}
    </div>
  );
}

const views = [
  { d: "Mon", v: 420 },
  { d: "Tue", v: 380 },
  { d: "Wed", v: 510 },
  { d: "Thu", v: 470 },
  { d: "Fri", v: 890 },
  { d: "Sat", v: 1204 },
  { d: "Sun", v: 760 },
];

function ViewsChart() {
  const max = 1300;
  return (
    <figure className="rounded-[10px] border border-line-strong/70 bg-paper p-5 shadow-lift">
      <figcaption className="flex items-baseline justify-between">
        <span className="text-[13px] font-semibold">Menu views this week</span>
        <span className="font-display text-2xl font-bold tabular-nums tracking-tight">4,634</span>
      </figcaption>
      <div className="relative mt-5 h-[180px]">
        {[0, 400, 800, 1200].map((g) => (
          <div key={g} className="absolute inset-x-0 flex items-center gap-2" style={{ bottom: `${(g / max) * 100}%` }}>
            <span className="w-8 text-right text-[10px] tabular-nums text-faint">{g >= 1000 ? `${g / 1000}k` : g}</span>
            <span className="h-px flex-1 bg-line/70" />
          </div>
        ))}
        <div className="absolute inset-y-0 left-10 right-0 flex items-end gap-[2px]">
          {views.map((v) => (
            <div key={v.d} className="group relative flex h-full flex-1 items-end justify-center" title={`${v.d}: ${v.v.toLocaleString()} views`}>
              <div
                className={cn("w-[58%] max-w-[28px] rounded-t-[4px] transition-colors", v.d === "Sat" ? "bg-orange" : "bg-orange/35 group-hover:bg-orange/60")}
                style={{ height: `${(v.v / max) * 100}%` }}
              />
              {v.d === "Sat" && (
                <span className="absolute text-[10.5px] font-semibold tabular-nums" style={{ bottom: `${(v.v / max) * 100 + 3}%` }}>
                  1,204
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="ml-10 mt-2 flex">
        {views.map((v) => (
          <span key={v.d} className="flex-1 text-center text-[10.5px] text-muted">{v.d}</span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4 text-[12px]">
        {[
          ["Instagram", "46%"],
          ["QR scans", "31%"],
          ["WhatsApp", "18%"],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-muted">{k}</p>
            <p className="font-semibold tabular-nums">{v}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

export function Features() {
  return (
    <section className="border-t border-line bg-paper py-20 md:py-28">
      <div className="container-x">
        <p className="eyebrow">Features</p>
        <h2 className="display-lg mt-4 max-w-[18ch]">Built around how food businesses actually work.</h2>

        {/* A — image left, text right */}
        <div className="mt-16 grid gap-10 md:mt-20 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          <Photo src={photos.spread} alt="A spread of dishes on a table" className="aspect-[4/3] w-full rounded-[4px] lg:aspect-[5/4]" tone="gold" />
          <div className="space-y-10">
            <FeatureText n="01" title="Beautiful digital menus">
              Large photos, clear prices, and typography that makes your food look as good as it tastes.
              Designed to load fast on any phone, on any network.
            </FeatureText>
            <FeatureText n="02" title="Custom branding">
              <p>Add your logo and cover photo, then choose a colour. Buttons, tags and highlights follow it everywhere.</p>
              <ul className="mt-5 flex flex-wrap gap-4">
                {swatches.map((s) => (
                  <li key={s.n} className="flex items-center gap-2 text-[13px] text-muted">
                    <span className="h-6 w-6 rounded-full ring-2 ring-paper ring-offset-1 ring-offset-line" style={{ background: s.c }} />
                    {s.n}
                  </li>
                ))}
              </ul>
            </FeatureText>
          </div>
        </div>

        {/* B — text left, UI right */}
        <div className="mt-24 grid gap-10 md:mt-32 lg:grid-cols-[1fr_1.2fr] lg:items-center lg:gap-16">
          <div className="space-y-10 lg:order-1">
            <FeatureText n="03" title="Food availability">
              Ran out of fish? Turn it off. It shows as “Sold out today” instead of disappearing,
              so customers know it’s usually there — and nobody has to ask.
            </FeatureText>
            <FeatureText n="04" title="Categories & add-ons">
              Group dishes the way your kitchen thinks. Drag to reorder. Add extras like plantain,
              protein or drink pairings with their own prices.
            </FeatureText>
          </div>
          <div className="lg:order-2">
            <MenuEditor />
          </div>
        </div>
      </div>

      {/* C — full-width moment */}
      <div className="mt-24 border-y border-line bg-cream py-16 md:mt-32 md:py-24">
        <div className="container-x">
          <p className="font-display text-sm font-semibold tabular-nums text-orange">05 — 06</p>
          <p className="mt-4 whitespace-nowrap font-display text-[clamp(1.4rem,7.6vw,7rem)] font-bold leading-[0.95] tracking-[-0.05em]">
            menuly.app/<span className="text-orange">your-business</span>
          </p>
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
            <FeatureText title="Shareable menu link">
              One short link that works everywhere — Instagram bio, WhatsApp status, Google Business,
              TikTok. Rich previews show your cover and name when it’s shared.
            </FeatureText>
            <FeatureText title="QR codes">
              Print-ready codes for every table, counter and takeaway bag. Same code forever — update
              the menu, not the sticker.
            </FeatureText>
          </div>
        </div>
      </div>

      <div className="container-x">
        {/* D — UI left, text right */}
        <div className="mt-24 grid gap-12 md:mt-32 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
          <div className="overflow-hidden rounded-[4px] bg-cream-2 px-4 py-12 sm:px-6 md:py-16">
            <Tickets />
          </div>
          <div className="space-y-10">
            <FeatureText n="07" title="Online ordering">
              Customers add to cart and check out from your menu — pickup or delivery. Their order arrives as a
              neat WhatsApp message to your team. No app downloads, no accounts.
            </FeatureText>
            <FeatureText n="08" title="Order management">
              Every order is clearly itemised with add-ons, notes, phone number and address — and saved in your
              dashboard, so you keep a record of every sale.
            </FeatureText>
          </div>
        </div>

        {/* E — text left, chart right */}
        <div className="mt-24 grid gap-10 md:mt-32 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-16">
          <FeatureText n="09" title="Analytics that answer real questions">
            <p>Which dishes do people look at most? Which day is busiest? Is Instagram or the table QR bringing more people in?</p>
            <ul className="mt-5 space-y-2 text-[15px]">
              {["Menu views and orders by day", "Most viewed and best-selling items", "Where your customers come from"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-leaf" /> {t}
                </li>
              ))}
            </ul>
          </FeatureText>
          <ViewsChart />
        </div>
      </div>
    </section>
  );
}
