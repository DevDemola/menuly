"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Business, CartLine } from "@/lib/types";

export type CartEntry = CartLine & { key: string };

const keyOf = (l: CartLine) => `${l.itemId}|${[...l.addOnIds].sort().join(",")}|${(l.note ?? "").trim()}`;

/** Cart kept per menu in localStorage, so a refresh doesn't lose the order. */
export function useCart(business: Business) {
  const storageKey = `menuly:cart:${business.slug}`;
  const [lines, setLines] = useState<CartEntry[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage after mount
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, [storageKey]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(lines));
    } catch {}
  }, [lines, ready, storageKey]);

  // Drop anything that's been removed or sold out since it was added.
  const valid = useMemo(
    () =>
      lines.filter((l) => {
        const item = business.items.find((i) => i.id === l.itemId);
        return item && item.available;
      }),
    [lines, business.items],
  );

  const priceOf = useCallback(
    (l: CartLine) => {
      const item = business.items.find((i) => i.id === l.itemId);
      if (!item) return 0;
      const extras = item.addOns.filter((a) => l.addOnIds.includes(a.id)).reduce((s, a) => s + a.price, 0);
      return (item.price + extras) * l.qty;
    },
    [business.items],
  );

  const add = useCallback((line: CartLine) => {
    const key = keyOf(line);
    setLines((prev) => {
      const found = prev.find((p) => p.key === key);
      if (found) return prev.map((p) => (p.key === key ? { ...p, qty: Math.min(99, p.qty + line.qty) } : p));
      return [...prev, { ...line, key }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => (qty <= 0 ? prev.filter((p) => p.key !== key) : prev.map((p) => (p.key === key ? { ...p, qty: Math.min(99, qty) } : p))));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = valid.reduce((s, l) => s + l.qty, 0);
  const total = valid.reduce((s, l) => s + priceOf(l), 0);

  return { lines: valid, add, setQty, clear, count, total, priceOf };
}
