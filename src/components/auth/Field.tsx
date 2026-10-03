"use client";

import { useId, useState, type ComponentProps, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/cn";

export const inputClass =
  "h-12 w-full rounded-sm border border-line-strong bg-paper px-3.5 text-[15px] text-ink placeholder:text-faint transition-[border,box-shadow] outline-none hover:border-ink-2/50 focus:border-ink focus:shadow-[0_0_0_3px_rgba(226,96,42,0.18)] aria-[invalid=true]:border-tomato";

export function Field({
  label,
  hint,
  error,
  aside,
  className,
  type = "text",
  ...props
}: ComponentProps<"input"> & {
  label: string;
  hint?: ReactNode;
  error?: string;
  aside?: ReactNode;
}) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={className}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label htmlFor={id} className="text-[13.5px] font-medium text-ink">
          {label}
        </label>
        {aside}
      </div>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={!!error}
          aria-describedby={error || hint ? `${id}-d` : undefined}
          className={cn(inputClass, isPassword && "pr-11")}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-1 top-1 grid h-10 w-10 place-items-center text-muted hover:text-ink"
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {(error || hint) && (
        <p id={`${id}-d`} className={cn("mt-1.5 text-[12.5px]", error ? "text-tomato" : "text-muted")}>
          {error || hint}
        </p>
      )}
    </div>
  );
}

export function Divider({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 flex items-center gap-3 text-[12.5px] text-muted">
      <span className="h-px flex-1 bg-line" />
      {children}
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}
