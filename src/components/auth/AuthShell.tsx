import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { Photo } from "@/components/ui/Photo";
import { QrCode } from "@/components/ui/QrCode";
import { photos } from "@/lib/images";
import { demoBusiness } from "@/lib/menu-data";

/**
 * Two-column auth layout: a calm form on the left, an editorial food
 * panel on the right (hidden on small screens).
 */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
      <div className="flex flex-col px-5 py-6 sm:px-10 lg:px-16">
        <Logo />
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-12">
          <h1 className="font-display text-[38px] font-bold leading-[1] tracking-[-0.04em]">{title}</h1>
          {subtitle && <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-8 text-[14.5px] text-ink-2">{footer}</div>}
        </div>
        <p className="text-[12.5px] text-muted">© {new Date().getFullYear()} Menuly · Your menu, beautifully served.</p>
      </div>

      <aside className="relative hidden overflow-hidden bg-ink lg:block">
        <Photo src={photos.restaurant} alt="" className="absolute inset-0 h-full w-full opacity-80" tone="warm" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute inset-x-10 bottom-10 flex items-end justify-between gap-8 text-paper">
          <blockquote className="max-w-[22rem]">
            <p className="font-display text-[34px] font-bold leading-[1.02] tracking-[-0.035em]">
              One link. Every dish. Always up to date.
            </p>
            <p className="mt-3 text-[14.5px] text-paper/70">
              Set up in an afternoon. Share it before dinner service.
            </p>
          </blockquote>
          <div className="w-[132px] shrink-0 rotate-3 bg-paper p-3 text-ink shadow-lift">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">Scan for menu</p>
            <QrCode value={`https://${demoBusiness.link}`} className="mt-2 w-full" accent="var(--color-orange)" />
          </div>
        </div>
      </aside>
    </div>
  );
}
