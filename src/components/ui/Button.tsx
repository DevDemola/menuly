import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "secondary" | "outline" | "secondaryLight" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-[background,color,box-shadow,transform] duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-orange text-paper shadow-[inset_0_-2px_0_rgba(0,0,0,0.14)] hover:bg-orange-deep",
  dark: "bg-ink text-paper hover:bg-ink-2",
  secondary:
    "bg-transparent text-ink shadow-[inset_0_0_0_1.5px_var(--color-ink)] hover:bg-ink hover:text-paper",
  outline:
    "bg-paper text-ink shadow-[inset_0_0_0_1px_var(--color-line-strong)] hover:shadow-[inset_0_0_0_1px_var(--color-ink)]",
  secondaryLight:
    "bg-transparent text-paper shadow-[inset_0_0_0_1.5px_rgba(251,247,240,0.55)] hover:bg-paper hover:text-ink",
  ghost: "text-ink hover:bg-cream-2",
  light: "bg-paper text-ink hover:bg-cream",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-sm",
  md: "h-11 px-5 text-[15px] rounded-sm",
  lg: "h-13 px-6 text-base rounded-md",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={buttonClass(variant, size, className)}>
      {children}
    </Link>
  );
}

export function Button({
  variant,
  size,
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}
