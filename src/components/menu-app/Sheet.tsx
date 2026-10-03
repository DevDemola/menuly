"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/** Bottom sheet on phones, centred panel on larger screens. */
export function Sheet({
  open,
  onClose,
  children,
  label,
  className,
  full,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  className?: string;
  /** Take the full height on phones (checkout). */
  full?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal aria-label={label}>
      <button className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <div
        className={cn(
          "relative flex w-full max-w-[520px] animate-rise flex-col overflow-hidden rounded-t-[20px] bg-paper text-ink shadow-lift sm:rounded-[16px]",
          full ? "h-[100dvh] rounded-t-none sm:h-auto sm:max-h-[90dvh] sm:rounded-[16px]" : "max-h-[92dvh]",
          className,
        )}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-paper/95 text-ink shadow-card"
          aria-label="Close"
        >
          <X className="h-4.5 w-4.5" />
        </button>
        {children}
      </div>
    </div>
  );
}
