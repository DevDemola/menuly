import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { Instagram, TikTok, XLogo } from "./icons";

const cols = [
  {
    h: "Product",
    links: [
      { l: "Product", href: "/#product" },
      { l: "How it works", href: "/#how-it-works" },
      { l: "Pricing", href: "/#pricing" },
      { l: "For businesses", href: "/#for-businesses" },
    ],
  },
  {
    h: "Resources",
    links: [
      { l: "Help", href: "#" },
      { l: "Contact", href: "mailto:hello@menuly.app" },
    ],
  },
  {
    h: "Legal",
    links: [
      { l: "Privacy", href: "#" },
      { l: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="overflow-hidden bg-cream">
      <div className="container-x pt-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_2fr]">
          <div>
            <Logo />
            <p className="mt-4 font-display text-xl font-medium tracking-tight text-ink-2">
              Your menu, beautifully served.
            </p>
            <div className="mt-6 flex gap-2">
              {[
                { Icon: Instagram, label: "Instagram" },
                { Icon: TikTok, label: "TikTok" },
                { Icon: XLogo, label: "X" },
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-line-strong text-ink-2 transition-colors hover:bg-ink hover:text-paper"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((c) => (
              <div key={c.h}>
                <p className="eyebrow">{c.h}</p>
                <ul className="mt-4 space-y-2.5 text-[15px]">
                  {c.links.map((x) => (
                    <li key={x.l}>
                      <Link href={x.href} className="text-ink-2 hover:text-ink">
                        {x.l}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col justify-between gap-2 border-t border-line py-5 text-[13px] text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Menuly. Made in Lagos.</p>
          <p>Prices shown in ₦. Built for food businesses everywhere.</p>
        </div>
      </div>
      <p
        aria-hidden
        className="pointer-events-none -mb-[0.22em] select-none text-center font-display text-[25vw] font-bold leading-[0.8] tracking-[-0.06em] text-cream-2"
      >
        menuly
      </p>
    </footer>
  );
}
