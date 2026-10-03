import { ArrowDown, FileText, ImageIcon } from "lucide-react";
import { Photo } from "@/components/ui/Photo";
import { photos } from "@/lib/images";
import { demoBusiness } from "@/lib/menu-data";

function Bubble({
  from,
  children,
  time,
}: {
  from: "them" | "you";
  children: React.ReactNode;
  time: string;
}) {
  const you = from === "you";
  return (
    <div className={you ? "flex justify-end" : "flex justify-start"}>
      <div
        className={
          "max-w-[82%] rounded-[12px] px-3 py-2 text-[13.5px] leading-snug shadow-[0_1px_0_rgba(0,0,0,0.06)] " +
          (you ? "rounded-br-[3px] bg-[#e4efd9]" : "rounded-bl-[3px] bg-paper")
        }
      >
        {children}
        <span className="ml-2 inline-block translate-y-1 text-[10px] text-faint">{time}</span>
      </div>
    </div>
  );
}

const pains = [
  { title: "PDF menus", body: "Pinch, zoom, scroll sideways. On a phone, nobody reads past page one." },
  { title: "WhatsApp screenshots", body: "Forwarded so many times the prices are from last year." },
  { title: "Outdated prices", body: "Gas went up. Tomatoes went up. The menu didn’t." },
  { title: "Unavailable meals", body: "The asun finished at 2pm. The flyer still says it’s here." },
];

export function Problem() {
  return (
    <section className="grain bg-cream-2 py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
          {/* Copy */}
          <div>
            <p className="eyebrow">The old way</p>
            <h2 className="display-lg mt-4 max-w-[12ch]">Still sending your menu as a PDF?</h2>
            <dl className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {pains.map((p) => (
                <div key={p.title} className="border-t border-ink/15 pt-4">
                  <dt className="font-display text-xl font-semibold tracking-tight">
                    <span className="decoration-tomato decoration-2 line-through">{p.title}</span>
                  </dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{p.body}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* The chat we've all seen */}
          <div className="relative">
            <div className="mx-auto max-w-[420px] overflow-hidden rounded-[14px] bg-[#e9e0cf] shadow-lift ring-1 ring-black/5">
              <div className="flex items-center gap-3 bg-ink px-4 py-3 text-paper">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-orange font-display text-sm font-bold">
                  OH
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold">{demoBusiness.name}</p>
                  <p className="text-[11px] text-paper/60">Business account</p>
                </div>
              </div>
              <div className="space-y-2 px-3 py-4">
                <Bubble from="you" time="12:04">Good afternoon. What do you have today?</Bubble>
                <Bubble from="them" time="12:31">Here’s today’s menu 👇</Bubble>
                <div className="flex justify-start">
                  <div className="flex w-[76%] items-center gap-3 rounded-[12px] rounded-bl-[3px] bg-paper p-2.5">
                    <span className="grid h-10 w-9 place-items-center rounded-[4px] bg-tomato text-paper">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium">MENU_FINAL_new (3).pdf</p>
                      <p className="text-[11px] text-faint">4 pages · 6.2 MB</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="relative w-[60%] overflow-hidden rounded-[12px] rounded-bl-[3px] bg-paper p-1">
                    <Photo src={photos.spread} alt="" className="h-28 w-full rounded-[9px] blur-[1.5px] grayscale-[30%]" tone="gold" />
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-[3px] bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                      <ImageIcon className="h-3 w-3" /> Screenshot_2023…
                    </span>
                  </div>
                </div>
                <Bubble from="you" time="12:33">Do you still have this? The asun</Bubble>
                <Bubble from="them" time="12:58">Sorry, it’s finished 😩</Bubble>
                <Bubble from="you" time="12:59">Ok. How much is the jollof now?</Bubble>
                <div className="flex items-center gap-1.5 pl-1 pt-1 text-[11px] text-muted">
                  <span className="flex gap-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted/60" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted/60" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted/60" />
                  </span>
                  typing… for 20 minutes
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Turn */}
        <div className="mt-20 flex flex-col items-start gap-6 border-t border-ink/15 pt-10 md:mt-28 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="display-md">There’s a simpler way.</p>
            <p className="mt-3 max-w-[30rem] text-lg leading-relaxed text-ink-2">
              Menuly gives your business one beautiful place for your menu — always current,
              easy to read on any phone, and one tap away.
            </p>
          </div>
          <a
            href="#product"
            className="group inline-flex items-center gap-3 font-display text-lg font-semibold tracking-tight"
          >
            <span className="grid h-12 w-12 place-items-center rounded-full bg-ink text-paper transition-transform group-hover:translate-y-0.5">
              <ArrowDown className="h-5 w-5" />
            </span>
            Meet Menuly
          </a>
        </div>
      </div>
    </section>
  );
}
