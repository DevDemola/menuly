import { Package, Printer, Store, Table2, Ticket } from "lucide-react";
import { Phone } from "@/components/menu/Phone";
import { QrCode } from "@/components/ui/QrCode";
import { LogoMark } from "@/components/ui/Logo";
import { Photo } from "@/components/ui/Photo";
import { demoBusiness, menuItems, naira } from "@/lib/menu-data";
import { photos } from "@/lib/images";

const places = [
  { label: "Tables", Icon: Table2 },
  { label: "Counters", Icon: Store },
  { label: "Packaging", Icon: Package },
  { label: "Flyers", Icon: Ticket },
  { label: "Posters", Icon: Printer },
];

const url = `https://${demoBusiness.link}`;

function TableTent() {
  return (
    <div className="relative w-[250px]">
      <div className="bg-paper px-6 pb-6 pt-5 shadow-[0_30px_60px_-25px_rgba(0,0,0,0.55)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="grid h-6 w-6 place-items-center rounded-[5px] bg-orange font-display text-[10px] font-bold text-paper">OH</span>
            <span className="text-[12px] font-semibold">{demoBusiness.name}</span>
          </div>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Table 12</span>
        </div>
        <p className="mt-5 font-display text-[30px] font-bold leading-[0.95] tracking-[-0.04em]">
          See the menu.
          <br />
          <span className="text-orange">Order from here.</span>
        </p>
        <div className="mt-5 border border-line p-3">
          <QrCode value={url} className="w-full" accent="var(--color-orange)" />
        </div>
        <div className="mt-3 flex items-center justify-between text-[10.5px] text-muted">
          <span>{demoBusiness.link}</span>
          <span className="flex items-center gap-1">
            <LogoMark className="h-3.5 w-3.5" /> menuly
          </span>
        </div>
      </div>
      {/* card stand */}
      <div className="mx-auto h-3 w-[86%] bg-[#c9b79c]" />
    </div>
  );
}

function ScanScreen() {
  const item = menuItems[2];
  return (
    <div className="relative h-full bg-[#2a221b]">
      {/* "camera" view of the table */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,#6b4a32_0%,#3a2a1e_55%,#1d1712_100%)]" />
      <div className="absolute left-1/2 top-[86px] w-[150px] -translate-x-1/2 rotate-[5deg] bg-paper p-3 opacity-95 shadow-2xl">
        <QrCode value={url} className="w-full" accent="var(--color-orange)" />
      </div>
      {/* viewfinder brackets */}
      <div className="absolute left-1/2 top-[70px] h-[180px] w-[180px] -translate-x-1/2">
        {["left-0 top-0 border-l-[3px] border-t-[3px] rounded-tl-[14px]", "right-0 top-0 border-r-[3px] border-t-[3px] rounded-tr-[14px]", "left-0 bottom-0 border-l-[3px] border-b-[3px] rounded-bl-[14px]", "right-0 bottom-0 border-r-[3px] border-b-[3px] rounded-br-[14px]"].map((c) => (
          <span key={c} className={"absolute h-8 w-8 border-gold " + c} />
        ))}
      </div>
      <div className="absolute left-1/2 top-[262px] -translate-x-1/2 whitespace-nowrap rounded-full bg-gold px-3 py-1.5 text-[11.5px] font-semibold text-ink">
        {demoBusiness.link}
      </div>

      {/* menu sheet sliding up */}
      <div className="absolute inset-x-0 bottom-0 h-[250px] rounded-t-[22px] bg-paper px-4 text-ink pt-2.5 shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.5)]">
        <span className="mx-auto block h-1 w-9 rounded-full bg-line-strong" />
        <div className="mt-3 flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-[11px] bg-orange font-display text-sm font-bold text-paper">OH</span>
          <div className="leading-tight">
            <p className="font-display text-[17px] font-bold tracking-[-0.02em]">{demoBusiness.name}</p>
            <p className="mt-0.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-leaf">
              <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> Open · Table 12
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-3 border-t border-line pt-3">
          <Photo src={item.photo} alt="" className="h-14 w-14 rounded-[8px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-semibold">{item.name}</p>
            <p className="line-clamp-1 text-[11px] text-muted">{item.description}</p>
            <p className="mt-0.5 text-[12px] font-semibold tabular-nums">{naira(item.price)}</p>
          </div>
        </div>
        <div className="mt-3 flex h-10 items-center justify-center rounded-[11px] bg-ink text-[12.5px] font-semibold text-paper">
          View full menu
        </div>
      </div>
    </div>
  );
}

export function QrSection() {
  return (
    <section className="relative overflow-hidden bg-orange text-paper">
      <div className="container-x grid gap-14 py-20 md:py-28 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow !text-paper/70">QR menus</p>
          <h2 className="display-lg mt-4 max-w-[12ch]">One scan. Straight to your menu.</h2>
          <p className="mt-6 max-w-[28rem] text-lg leading-relaxed text-paper/85">
            Put your menu on tables, counters, packaging, flyers, or anywhere your customers are.
            Download print-ready QR codes in your brand colours — and never reprint when prices change.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2">
            {places.map(({ label, Icon }) => (
              <li key={label} className="inline-flex items-center gap-2 rounded-[6px] bg-paper/12 px-3 py-2 text-[14px] font-medium ring-1 ring-paper/25">
                <Icon className="h-4 w-4" strokeWidth={1.75} /> {label}
              </li>
            ))}
          </ul>
        </div>

        {/* Physical → digital */}
        <div className="relative mx-auto h-[380px] w-full max-w-[560px] sm:h-[620px]">
          <div className="absolute left-1/2 top-0 h-[620px] w-[560px] origin-top -translate-x-1/2 scale-[0.6] sm:scale-100">
            {/* the table surface */}
            <div className="absolute inset-x-0 bottom-0 h-[230px] overflow-hidden">
              <Photo src={photos.counter} alt="" className="h-full w-full opacity-35 mix-blend-multiply" tone="deep" />
            </div>
            <div className="absolute bottom-[70px] left-0 -rotate-[3deg] text-ink">
              <TableTent />
            </div>
            <div className="absolute right-0 top-0 rotate-[4deg]">
              <Phone lightStatus>
                <ScanScreen />
              </Phone>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
