"use client";

import { useState } from "react";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import { menuItems, naira } from "@/lib/menu-data";

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[22px] w-[38px] shrink-0 rounded-full transition-colors",
        checked ? "bg-leaf" : "bg-line-strong",
      )}
    >
      <span
        className={cn(
          "absolute top-[3px] h-4 w-4 rounded-full bg-paper shadow transition-[left]",
          checked ? "left-[19px]" : "left-[3px]",
        )}
      />
    </button>
  );
}

export function AvailabilityList({ limit = 4 }: { limit?: number }) {
  const [state, setState] = useState(() =>
    Object.fromEntries(menuItems.map((m) => [m.id, m.available])),
  );
  return (
    <ul className="divide-y divide-line">
      {menuItems.slice(0, limit).map((m) => (
        <li key={m.id} className="flex items-center gap-3 py-2.5">
          <Photo src={m.photo} alt="" className="h-9 w-9 shrink-0 rounded-[5px]" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium">{m.name}</p>
            <p className="text-[11.5px] tabular-nums text-muted">
              {naira(m.price)} ·{" "}
              <span className={state[m.id] ? "text-leaf" : "text-tomato"}>
                {state[m.id] ? "Available" : "Sold out"}
              </span>
            </p>
          </div>
          <Toggle
            checked={state[m.id]}
            onChange={(v) => setState((s) => ({ ...s, [m.id]: v }))}
            label={`${m.name} available`}
          />
        </li>
      ))}
    </ul>
  );
}
