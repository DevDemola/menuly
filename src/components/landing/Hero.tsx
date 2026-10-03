import { ArrowRight, Check, Copy, Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { QrCode } from "@/components/ui/QrCode";
import { LogoMark } from "@/components/ui/Logo";
import { Phone } from "@/components/menu/Phone";
import { MenuHomeScreen } from "@/components/menu/MenuScreens";
import { demoBusiness, menuItems, naira } from "@/lib/menu-data";
import { photos } from "@/lib/images";

export function Hero() {
  const featured = menuItems[0];
  return (
    <section className="relative overflow-hidden pb-16 pt-8 md:pb-24 md:pt-14">
      <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_480px] lg:gap-8 xl:grid-cols-[1fr_600px]">
        {/* Copy */}
        <div className="animate-rise">
          <p className="eyebrow flex items-center gap-2">
            <span className="h-px w-6 bg-orange" />
            Digital menus for food businesses
          </p>
          <h1 className="display-xl mt-5">
            Your menu,
            <br />
            beautifully
            <br />
            <span className="relative inline-block text-orange">
              served.
              <svg
                viewBox="0 0 300 18"
                className="absolute -bottom-2 left-0 h-3 w-full text-gold md:-bottom-3"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path d="M3 12 C 60 4, 140 3, 297 9" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-8 max-w-[34rem] text-[17px] leading-[1.6] text-ink-2 md:text-lg">
            Give your customers a better way to discover what you serve. Create a beautiful
            digital menu, share it with one link or QR code, and keep everything easy to manage.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/signup" size="lg">
              Create your menu <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="#how-it-works" size="lg" variant="secondary">
              See how it works
            </ButtonLink>
          </div>
          <p className="mt-4 flex items-center gap-1.5 text-sm text-muted">
            <Check className="h-4 w-4 text-leaf" /> No credit card required.
          </p>
        </div>

        {/* Composition — a restaurant table, translated to digital */}
        <div className="relative mx-auto h-[360px] w-full max-w-[600px] sm:h-[540px] lg:h-[512px] xl:h-[640px]">
          <div className="absolute left-1/2 top-0 h-[640px] w-[600px] origin-top -translate-x-1/2 scale-[0.56] sm:scale-[0.84] lg:scale-[0.8] xl:scale-100">
            {/* Editorial photo plate */}
            <figure className="absolute right-0 top-0 h-[560px] w-[440px]">
              <Photo
                src={photos.heroTable}
                alt="A table set with plates of food"
                className="h-full w-full rounded-[4px]"
                priority
              />
            </figure>

            {/* Phone with live menu */}
            <div className="absolute left-0 top-[46px]">
              <Phone lightStatus>
                <MenuHomeScreen />
              </Phone>
            </div>

            {/* Floating item card */}
            <div className="absolute right-[28px] top-[118px] w-[236px] rounded-[10px] bg-paper p-3 shadow-lift">
              <div className="flex gap-3">
                <Photo src={featured.photo} alt="" className="h-14 w-14 shrink-0 rounded-[6px]" />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold">{featured.name}</p>
                  <p className="mt-0.5 text-[13px] font-semibold tabular-nums text-ink-2">
                    {naira(featured.price)}
                  </p>
                  <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-leaf">
                    <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> Available
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-line pt-2.5 text-[12px]">
                <span className="text-muted">+ Extra plantain</span>
                <span className="inline-flex items-center gap-1 rounded-[6px] bg-orange px-2 py-1 font-semibold text-paper">
                  <Plus className="h-3 w-3" strokeWidth={3} /> Add
                </span>
              </div>
            </div>

            {/* Order toast */}
            <div className="absolute right-[150px] top-[262px] flex items-center gap-2 rounded-full bg-ink py-2 pl-2 pr-4 text-[12px] font-medium text-paper shadow-lift">
              <span className="grid h-6 w-6 place-items-center rounded-full bg-leaf">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              Added to order · 2 items
            </div>

            {/* QR table tent */}
            <div className="absolute bottom-[8px] right-[36px] w-[178px] -rotate-[4deg] bg-paper px-4 pb-4 pt-3.5 shadow-lift">
              <div className="flex items-center gap-1.5">
                <LogoMark className="h-4 w-4" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">Table 7</span>
              </div>
              <p className="mt-2 font-display text-[19px] font-bold leading-[1.05] tracking-[-0.03em]">
                Scan for
                <br />
                our menu
              </p>
              <QrCode value={`https://${demoBusiness.link}`} className="mt-3 w-full" accent="var(--color-orange)" />
              <p className="mt-2 text-center text-[10px] font-medium tracking-wide text-muted">
                {demoBusiness.link}
              </p>
            </div>

            {/* Link chip */}
            <div className="absolute right-[24px] top-[24px] flex items-center gap-2 rounded-[8px] border border-line bg-paper py-2 pl-3 pr-2 text-[12.5px] shadow-card">
              <span className="font-medium">{demoBusiness.link}</span>
              <span className="grid h-6 w-6 place-items-center rounded-[5px] bg-cream text-muted">
                <Copy className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
