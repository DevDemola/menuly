import { Copy, ImagePlus, Instagram, MessageCircle, Printer } from "./icons";
import { Photo } from "@/components/ui/Photo";
import { QrCode } from "@/components/ui/QrCode";
import { demoBusiness, naira } from "@/lib/menu-data";
import { photos } from "@/lib/images";

function CreateVisual() {
  return (
    <div className="rounded-[8px] border border-line bg-paper p-4 shadow-card">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-faint">New item</p>
      <div className="mt-3 flex gap-3">
        <div className="relative h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[6px]">
          <Photo src={photos.suya} alt="" className="h-full w-full" />
          <span className="absolute bottom-1 right-1 grid h-6 w-6 place-items-center rounded-[4px] bg-paper/90">
            <ImagePlus className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="flex-1 space-y-2 text-[13px]">
          <div className="rounded-[5px] border border-line px-2.5 py-1.5 font-medium">Beef Suya Platter</div>
          <div className="flex gap-2">
            <div className="flex-1 rounded-[5px] border border-line px-2.5 py-1.5 tabular-nums">{naira(6000)}</div>
            <div className="flex-1 rounded-[5px] border border-line px-2.5 py-1.5 text-muted">Grills</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareVisual() {
  return (
    <div className="flex gap-3 rounded-[8px] border border-line bg-paper p-4 shadow-card">
      <QrCode value={`https://${demoBusiness.link}`} className="h-[96px] w-[96px] shrink-0" accent="var(--color-orange)" />
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-center justify-between gap-2 rounded-[5px] bg-cream px-2.5 py-2 text-[12.5px] font-medium">
          <span className="truncate">{demoBusiness.link}</span>
          <Copy className="h-3.5 w-3.5 shrink-0 text-muted" />
        </div>
        <div className="flex gap-1.5">
          {[
            { Icon: MessageCircle, label: "WhatsApp" },
            { Icon: Instagram, label: "Instagram" },
            { Icon: Printer, label: "Print" },
          ].map(({ Icon, label }) => (
            <span key={label} className="flex flex-1 items-center justify-center gap-1 rounded-[5px] border border-line py-1.5 text-[11px] text-ink-2">
              <Icon className="h-3 w-3" /> {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServeVisual() {
  return (
    <div className="overflow-hidden rounded-[8px] border border-line bg-[#e9e0cf] shadow-card">
      <div className="flex items-center gap-2 bg-ink px-3 py-2 text-paper">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-orange font-display text-[10px] font-bold">OH</span>
        <span className="text-[12px] font-semibold">Ofada House · WhatsApp</span>
      </div>
      <div className="p-3">
        <div className="ml-auto max-w-[92%] rounded-[10px] rounded-br-[3px] bg-[#e4efd9] px-3 py-2 text-[12px] leading-[1.45] text-ink">
          <p className="font-semibold">New order — Ofada House</p>
          <p className="text-muted">Order #K7P2Q</p>
          <p className="mt-1.5">1× Party Jollof & Chicken — {naira(5300)}</p>
          <p className="pl-3 text-muted">+ Extra plantain</p>
          <p>2× House Chapman — {naira(4000)}</p>
          <p className="mt-1.5 font-semibold">Total: {naira(9300)}</p>
          <p className="mt-1.5">Delivery · Adaeze O. · 0803…</p>
          <p className="text-muted">12 Admiralty Way, Lekki</p>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    n: "01",
    title: "Create",
    body: "Add your food, prices, photos, categories, and business information.",
    Visual: CreateVisual,
  },
  {
    n: "02",
    title: "Share",
    body: "Get your own menu link and QR code. Put it on Instagram, WhatsApp, tables, flyers, or anywhere customers find you.",
    Visual: ShareVisual,
  },
  {
    n: "03",
    title: "Serve",
    body: "Customers add what they want to their cart and check out. The full order — items, name, address — lands in your WhatsApp.",
    Visual: ServeVisual,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-16 border-t border-line bg-paper py-20 md:py-28">
      <div className="container-x">
        <p className="eyebrow">How it works</p>
        <h2 className="display-lg mt-4 max-w-[18ch]">
          From “what’s on the menu?” to <span className="text-orange">“I’ll have that.”</span>
        </h2>

        <ol className="mt-16 grid gap-14 md:grid-cols-3 md:gap-8 lg:gap-12">
          {steps.map(({ n, title, body, Visual }) => (
            <li key={n} className="flex flex-col">
              <div className="flex items-end justify-between border-b-2 border-ink pb-3">
                <span className="font-display text-[88px] font-bold leading-[0.8] tracking-[-0.06em] text-ink md:text-[104px]">
                  {n}
                </span>
                <span className="font-display text-2xl font-semibold tracking-tight">{title}</span>
              </div>
              <p className="mt-5 min-h-[4.5rem] text-[16px] leading-relaxed text-ink-2">{body}</p>
              <div className="mt-6">
                <Visual />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
