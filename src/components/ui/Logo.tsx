import Link from "next/link";
import { cn } from "@/lib/cn";

/** The Menuly mark: a menu card — three dishes, one dotted leader. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden>
      <rect width="32" height="32" rx="7" fill="var(--color-orange)" />
      <rect x="8" y="9" width="10" height="2.6" rx="1.3" fill="var(--color-paper)" />
      <circle cx="23" cy="10.3" r="1.6" fill="var(--color-paper)" />
      <rect x="8" y="14.7" width="16" height="2.6" rx="1.3" fill="var(--color-paper)" />
      <rect x="8" y="20.4" width="7" height="2.6" rx="1.3" fill="var(--color-paper)" />
      <path d="M17.5 21.7h6.5" stroke="var(--color-paper)" strokeWidth="1.6" strokeDasharray="0.1 2.4" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  className,
  inverted,
  href = "/",
}: {
  className?: string;
  inverted?: boolean;
  href?: string;
}) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2", className)} aria-label="Menuly home">
      <LogoMark />
      <span
        className={cn(
          "font-display text-[22px] font-bold leading-none tracking-[-0.04em]",
          inverted ? "text-paper" : "text-ink",
        )}
      >
        menuly
      </span>
    </Link>
  );
}
