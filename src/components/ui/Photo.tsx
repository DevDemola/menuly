"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type PhotoProps = {
  src: string;
  alt: string;
  className?: string;
  /** Label shown on the placeholder if the image fails to load. */
  label?: string;
  priority?: boolean;
  tone?: "warm" | "deep" | "green" | "gold";
};

const tones = {
  warm: "from-[#ecbf98] via-[#d9784b] to-[#a3462b]",
  deep: "from-[#5a3a28] via-[#3a261c] to-[#1d1a16]",
  green: "from-[#c3d6b4] via-[#7a9a6f] to-[#3e6a47]",
  gold: "from-[#f3d68c] via-[#e3a92f] to-[#b6731e]",
};

/**
 * Image with an on-brand fallback. Uses a plain <img> so remote
 * placeholders work without image-optimizer config.
 */
export function Photo({ src, alt, className, label, priority, tone = "warm" }: PhotoProps) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);
  const id = useId();

  // Catch images that failed before hydration attached onError.
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn("relative overflow-hidden bg-gradient-to-br", tones[tone], className)}
      >
        <svg className="absolute inset-0 h-full w-full opacity-30 mix-blend-overlay" aria-hidden>
          <defs>
            <pattern id={id} width="18" height="18" patternUnits="userSpaceOnUse">
              <circle cx="9" cy="9" r="1.2" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
        <div className="absolute left-1/2 top-1/2 aspect-square w-[62%] max-w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15 shadow-[inset_0_0_0_8px_rgba(255,255,255,0.12),0_20px_40px_-10px_rgba(0,0,0,0.3)]">
          <div className="absolute inset-[22%] rounded-full bg-white/10" />
        </div>
        {label && (
          <span className="absolute bottom-2 left-2 rounded-[3px] bg-black/35 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white/90">
            {label}
          </span>
        )}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("object-cover", className)}
    />
  );
}
