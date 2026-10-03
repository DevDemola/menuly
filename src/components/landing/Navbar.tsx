"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const links = [
  { href: "#product", label: "Product" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#for-businesses", label: "For businesses" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background,box-shadow,backdrop-filter] duration-200",
        scrolled || open
          ? "bg-cream/90 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <nav className="container-x flex h-16 items-center justify-between gap-6">
        <Logo />

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-sm px-3 py-2 text-[14.5px] font-medium text-ink-2 transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/login" className="px-3 py-2 text-[14.5px] font-medium text-ink-2 hover:text-ink">
            Log in
          </Link>
          <ButtonLink href="/signup" size="sm" className="h-10 px-4">
            Create your menu
          </ButtonLink>
        </div>

        <button
          type="button"
          className="-mr-2 grid h-10 w-10 place-items-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col bg-cream px-5 pb-8 pt-4 md:hidden">
          <ul className="divide-y divide-line border-y border-line">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-4 font-display text-2xl font-semibold tracking-tight"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-auto grid gap-2">
            <ButtonLink href="/signup" size="lg">Create your menu</ButtonLink>
            <ButtonLink href="/login" variant="secondary" size="lg">Log in</ButtonLink>
          </div>
        </div>
      )}
    </header>
  );
}
