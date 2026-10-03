import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** A restrained, realistic phone frame. Content scrolls inside the screen. */
export function Phone({
  children,
  className,
  screenClassName,
  lightStatus = false,
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
  /** Use white status-bar text when the screen starts with a dark image. */
  lightStatus?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative w-[280px] shrink-0 rounded-[46px] bg-[#171410] p-[9px] shadow-[inset_0_0_0_1.5px_rgba(255,255,255,0.14),var(--shadow-phone)]",
        className,
      )}
    >
      {/* side buttons */}
      <span className="absolute -left-[3px] top-[110px] h-12 w-[3px] rounded-l bg-ink-2" aria-hidden />
      <span className="absolute -right-[3px] top-[140px] h-16 w-[3px] rounded-r bg-ink-2" aria-hidden />
      <div
        className={cn(
          "relative h-[580px] overflow-hidden rounded-[38px] bg-paper",
          screenClassName,
        )}
      >
        {/* status bar */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-0 top-0 z-30 flex h-9 items-center justify-between px-6 text-[11px] font-semibold",
            lightStatus ? "text-white" : "text-ink",
          )}
        >
          <span>9:41</span>
          <span className="absolute left-1/2 top-2 h-[22px] w-[84px] -translate-x-1/2 rounded-full bg-[#0d0b09]" />
          <span className="flex items-center gap-1">
            <svg width="15" height="10" viewBox="0 0 15 10" aria-hidden>
              <rect x="0" y="6" width="3" height="4" rx="0.6" fill="currentColor" />
              <rect x="4" y="4" width="3" height="6" rx="0.6" fill="currentColor" />
              <rect x="8" y="2" width="3" height="8" rx="0.6" fill="currentColor" />
              <rect x="12" y="0" width="3" height="10" rx="0.6" fill="currentColor" />
            </svg>
            <svg width="22" height="11" viewBox="0 0 22 11" aria-hidden>
              <rect x="0.5" y="0.5" width="18" height="10" rx="2.5" fill="none" stroke="currentColor" opacity="0.5" />
              <rect x="2" y="2" width="13" height="7" rx="1.4" fill="currentColor" />
              <rect x="19.5" y="3.5" width="1.5" height="4" rx="0.6" fill="currentColor" opacity="0.5" />
            </svg>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}
