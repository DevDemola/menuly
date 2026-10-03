"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChefHat,
  Coffee,
  CookingPot,
  Croissant,
  Eye,
  Loader2,
  ImagePlus,
  Store,
  Upload,
  Utensils,
  Wine,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { Phone } from "@/components/menu/Phone";
import { MenuHomeScreen } from "@/components/menu/MenuScreens";
import { Toggle } from "@/components/dashboard/AvailabilityList";
import { inputClass } from "@/components/auth/Field";
import { photos } from "@/lib/images";
import { formatPhone, naira, slugify as slugifyBase, toWhatsAppNumber } from "@/lib/format";
import { compressImage } from "@/lib/image-client";
import { cn } from "@/lib/cn";

/* ---------------------------------------------------------------- */

const STEPS = [
  { title: "Your business", short: "Business" },
  { title: "Branding", short: "Branding" },
  { title: "First category", short: "Category" },
  { title: "First item", short: "Item" },
  { title: "Preview", short: "Preview" },
];

const TYPES = [
  { v: "Restaurant", Icon: ChefHat },
  { v: "Café", Icon: Coffee },
  { v: "Bakery", Icon: Croissant },
  { v: "Food vendor", Icon: Store },
  { v: "Caterer", Icon: CookingPot },
  { v: "Bar & lounge", Icon: Wine },
  { v: "Other", Icon: Utensils },
];

const CATEGORY_IDEAS: Record<string, string[]> = {
  Restaurant: ["Rice dishes", "Swallow & soups", "Grills", "Sides", "Drinks"],
  Café: ["Coffee", "Pastries", "Breakfast", "Smoothies", "Sandwiches"],
  Bakery: ["Breads", "Cakes", "Pastries", "Meat pies", "Custom orders"],
  "Food vendor": ["Today’s special", "Rice", "Small chops", "Drinks"],
  Caterer: ["Party packs", "Small chops", "Trays", "Desserts"],
  "Bar & lounge": ["Cocktails", "Mocktails", "Grills", "Shisha", "Beer & wine"],
  Other: ["Mains", "Sides", "Drinks", "Desserts"],
};

const COLORS = ["#e2602a", "#b8402e", "#3e6a47", "#e3a92f", "#1d1a16", "#2f5d8a", "#7a3b69"];

const COVERS = [photos.cover, photos.restaurant, photos.spread];
const ITEM_PHOTOS = [photos.jollof, photos.suya, photos.smallChops, photos.chapman];

type State = {
  businessName: string;
  businessType: string;
  area: string;
  whatsapp: string;
  pickup: boolean;
  delivery: boolean;
  logoUrl: string | null;
  coverUrl: string | null;
  accent: string;
  category: string;
  itemName: string;
  itemPrice: string;
  itemDescription: string;
  itemPhoto: string | null;
  itemAvailable: boolean;
};

const empty: State = {
  businessName: "",
  businessType: "",
  area: "",
  whatsapp: "",
  pickup: true,
  delivery: true,
  logoUrl: null,
  coverUrl: COVERS[0],
  accent: COLORS[0],
  category: "",
  itemName: "",
  itemPrice: "",
  itemDescription: "",
  itemPhoto: null,
  itemAvailable: true,
};

const demo: State = {
  businessName: "Ofada House",
  businessType: "Restaurant",
  area: "Lekki Phase 1, Lagos",
  whatsapp: "08030000000",
  pickup: true,
  delivery: true,
  logoUrl: null,
  coverUrl: COVERS[0],
  accent: COLORS[0],
  category: "Rice dishes",
  itemName: "Ofada Rice & Ayamase",
  itemPrice: "5200",
  itemDescription: "Local ofada rice with green pepper sauce, assorted meat and boiled egg.",
  itemPhoto: photos.ofada,
  itemAvailable: true,
};

const slugify = (s: string) => (s.trim() ? slugifyBase(s) : "your-business");

/** The host this app is running on (e.g. localhost:3000 or your domain). */
function useHost() {
  return useSyncExternalStore(
    () => () => {},
    () => window.location.host,
    () => "menuly.app",
  );
}

/* ---------------------------------------------------------------- */

export function Onboarding() {
  const params = useSearchParams();
  const router = useRouter();
  const initialStep = Math.min(5, Math.max(1, Number(params.get("step")) || 1));
  const [step, setStep] = useState(initialStep);
  const [s, setS] = useState<State>(initialStep > 1 ? demo : empty);
  const [touched, setTouched] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Prefill business name from signup
  useEffect(() => {
    try {
      const b = sessionStorage.getItem("menuly:business");
      // Read after mount: sessionStorage isn't available during prerender.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (b && initialStep === 1) setS((p) => ({ ...p, businessName: b }));
    } catch {}
  }, [initialStep]);

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
    const url = new URL(window.location.href);
    url.searchParams.set("step", String(step));
    window.history.replaceState(null, "", url);
  }, [step]);

  const set = <K extends keyof State>(k: K, v: State[K]) => setS((p) => ({ ...p, [k]: v }));
  const host = useHost();
  const slug = slugify(s.businessName);
  const link = `${host}/m/${slug}`;

  const valid: Record<number, boolean> = {
    1: s.businessName.trim().length > 1 && !!s.businessType && !!toWhatsAppNumber(s.whatsapp) && (s.pickup || s.delivery),
    2: true,
    3: s.category.trim().length > 0,
    4: s.itemName.trim().length > 0 && Number(s.itemPrice) > 0,
    5: true,
  };

  const next = () => {
    setTouched(true);
    if (!valid[step]) return;
    setTouched(false);
    setStep((n) => Math.min(5, n + 1));
  };
  const back = () => setStep((n) => Math.max(1, n - 1));

  const previewItems = useMemo(
    () => [
      {
        id: "first",
        name: s.itemName || "Your first dish",
        description: s.itemDescription || (step < 5 ? "A short description helps customers decide." : ""),
        price: Number(s.itemPrice) || 0,
        photo: s.itemPhoto || "",
        available: s.itemAvailable,
      },
    ],
    [s.itemName, s.itemDescription, s.itemPrice, s.itemPhoto, s.itemAvailable, step],
  );

  const preview = (
    <Phone lightStatus={!!s.coverUrl}>
      <MenuHomeScreen
        brand={{
          name: s.businessName || "Your business",
          area: s.area || s.businessType || "Your location",
          status: "Open now",
          accent: s.accent,
          logoUrl: s.logoUrl,
          coverUrl: s.coverUrl,
        }}
        categories={[s.category || "Your first category"]}
        items={previewItems}
        cart={null}
        ghostRows={2}
      />
    </Phone>
  );

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-6 px-5 md:px-8">
          <Logo />
          <ol className="hidden items-center gap-1 md:flex" aria-label="Setup progress">
            {STEPS.map((st, i) => {
              const n = i + 1;
              const done = n < step;
              const current = n === step;
              return (
                <li key={st.short} className="flex items-center gap-1">
                  {i > 0 && <span className={cn("h-px w-6", done || current ? "bg-ink" : "bg-line-strong")} />}
                  <button
                    type="button"
                    disabled={n > step}
                    onClick={() => setStep(n)}
                    aria-current={current ? "step" : undefined}
                    className={cn(
                      "flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-[13px] font-medium transition-colors",
                      current ? "bg-ink text-paper" : done ? "text-ink hover:bg-cream-2" : "text-faint",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-6 w-6 place-items-center rounded-full text-[11.5px] font-semibold tabular-nums",
                        current ? "bg-orange text-paper" : done ? "bg-leaf text-paper" : "border border-line-strong",
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : n}
                    </span>
                    {st.short}
                  </button>
                </li>
              );
            })}
          </ol>
          <Link href="/" className="text-[13.5px] font-medium text-muted hover:text-ink">
            Save & exit
          </Link>
        </div>
        {/* mobile progress */}
        <div className="flex gap-1 px-5 pb-3 md:hidden">
          {STEPS.map((_, i) => (
            <span key={i} className={cn("h-1 flex-1 rounded-full", i < step ? "bg-orange" : "bg-line")} />
          ))}
        </div>
      </header>

      {step < 5 ? (
        <main className="grid w-full flex-1 grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,1fr)_minmax(460px,40%)]">
          <section className="flex flex-col px-5 py-10 md:px-8 md:py-14 lg:pl-[max(2rem,calc((100vw-1240px)/2+2rem))] lg:pr-16">
            <div className="w-full max-w-[540px]">
              <p className="eyebrow">
                Step {step} of 5
              </p>
              <h1
                ref={headingRef}
                tabIndex={-1}
                className="mt-3 font-display text-[36px] font-bold leading-[1.02] tracking-[-0.04em] outline-none md:text-[44px]"
              >
                {step === 1 && "Tell us about your business."}
                {step === 2 && "Add your branding."}
                {step === 3 && "Create your first menu category."}
                {step === 4 && "Add your first food item."}
              </h1>
              <p className="mt-3 text-[16px] leading-relaxed text-ink-2">
                {step === 1 && "This is how customers will find and recognise you."}
                {step === 2 && "Make your menu look like your business. You can change all of this later."}
                {step === 3 && "Categories help customers get to what they want fast. Start with one — add more anytime."}
                {step === 4 && "Just one to start. A good photo and a clear price go a long way."}
              </p>

              <div className="mt-9">
                {step === 1 && <StepBusiness s={s} set={set} touched={touched} link={link} />}
                {step === 2 && <StepBranding s={s} set={set} />}
                {step === 3 && <StepCategory s={s} set={set} touched={touched} />}
                {step === 4 && <StepItem s={s} set={set} touched={touched} />}
              </div>

              <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
                {step > 1 ? (
                  <Button variant="ghost" onClick={back} className="-ml-3" aria-label="Back">
                    <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Back</span>
                  </Button>
                ) : (
                  <span />
                )}
                <div className="flex items-center gap-2">
                  {step === 2 && (
                    <Button variant="ghost" onClick={() => setStep(3)}>
                      Skip<span className="hidden sm:inline">&nbsp;for now</span>
                    </Button>
                  )}
                  <Button onClick={next} size="lg">
                    {step === 4 ? "Preview my menu" : "Continue"} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Live preview */}
          <aside className="hidden border-l border-line bg-cream-2/60 lg:block">
            <div className="sticky top-16 flex flex-col items-center px-8 py-12">
              <p className="mb-6 flex items-center gap-2 text-[12.5px] font-medium text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-leaf animate-pulse-dot" /> Live preview · {link}
              </p>
              {preview}
            </div>
          </aside>

          {/* Mobile preview toggle */}
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="fixed bottom-5 right-5 z-30 flex items-center gap-2 rounded-full bg-ink px-4 py-3 text-[14px] font-medium text-paper shadow-lift lg:hidden"
          >
            <Eye className="h-4 w-4" /> Preview
          </button>
          {showPreview && (
            <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink/80 p-5 backdrop-blur-sm lg:hidden" role="dialog" aria-modal aria-label="Menu preview">
              <button
                onClick={() => setShowPreview(false)}
                className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-paper text-ink"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="origin-center scale-[0.88] sm:scale-100">{preview}</div>
            </div>
          )}
        </main>
      ) : (
        <StepPreview s={s} preview={preview} onEdit={() => setStep(4)} onPublished={() => router.push("/dashboard?welcome=1")} />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */

type StepProps = {
  s: State;
  set: <K extends keyof State>(k: K, v: State[K]) => void;
  touched?: boolean;
};

function Label({ children, hint }: { children: ReactNode; hint?: ReactNode }) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <span className="text-[13.5px] font-medium">{children}</span>
      {hint && <span className="text-[12.5px] text-muted">{hint}</span>}
    </div>
  );
}

function ErrorText({ show, children }: { show: boolean; children: ReactNode }) {
  if (!show) return null;
  return <p className="mt-1.5 text-[12.5px] text-tomato">{children}</p>;
}

function StepBusiness({ s, set, touched, link }: StepProps & { link: string }) {
  return (
    <div className="space-y-7">
      <label className="block">
        <Label>Business name</Label>
        <input
          className={inputClass}
          value={s.businessName}
          onChange={(e) => set("businessName", e.target.value)}
          placeholder="e.g. Mama Put Express"
          aria-invalid={touched && s.businessName.trim().length < 2}
          autoFocus
        />
        <p className="mt-1.5 text-[12.5px] text-muted">
          Your menu link: <span className="font-medium text-ink">{link}</span>
        </p>
        <ErrorText show={!!touched && s.businessName.trim().length < 2}>Enter your business name.</ErrorText>
      </label>

      <fieldset>
        <legend className="mb-2 text-[13.5px] font-medium">What kind of business is it?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {TYPES.map(({ v, Icon }) => {
            const on = s.businessType === v;
            return (
              <label
                key={v}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-sm border px-3 py-3 text-[14px] font-medium transition-colors",
                  on ? "border-ink bg-paper shadow-[inset_0_0_0_1px_var(--color-ink)]" : "border-line-strong hover:border-ink-2/60",
                )}
              >
                <input type="radio" name="type" value={v} checked={on} onChange={() => set("businessType", v)} className="sr-only" />
                <Icon className={cn("h-[18px] w-[18px]", on ? "text-orange" : "text-muted")} strokeWidth={1.75} />
                {v}
              </label>
            );
          })}
        </div>
        <ErrorText show={!!touched && !s.businessType}>Choose the option closest to your business.</ErrorText>
      </fieldset>

      <label className="block">
        <Label hint="Orders will be sent here">WhatsApp number</Label>
        <input
          className={inputClass}
          value={s.whatsapp}
          onChange={(e) => set("whatsapp", e.target.value)}
          inputMode="tel"
          autoComplete="tel"
          placeholder="e.g. 0803 123 4567"
          aria-invalid={touched && !toWhatsAppNumber(s.whatsapp)}
        />
        {toWhatsAppNumber(s.whatsapp) ? (
          <p className="mt-1.5 text-[12.5px] text-leaf">Customers’ orders will open a WhatsApp chat with {formatPhone(toWhatsAppNumber(s.whatsapp))}.</p>
        ) : (
          <p className="mt-1.5 text-[12.5px] text-muted">The number your receptionist or customer service uses on WhatsApp.</p>
        )}
        <ErrorText show={!!touched && !toWhatsAppNumber(s.whatsapp)}>Enter a valid WhatsApp number.</ErrorText>
      </label>

      <fieldset>
        <legend className="mb-2 text-[13.5px] font-medium">How can customers get their order?</legend>
        <div className="flex flex-wrap gap-2">
          {([
            ["pickup", "Pickup"],
            ["delivery", "Delivery"],
          ] as const).map(([k, label]) => (
            <label
              key={k}
              className={cn(
                "flex cursor-pointer items-center gap-2.5 rounded-sm border px-3.5 py-2.5 text-[14px] font-medium",
                s[k] ? "border-ink bg-paper shadow-[inset_0_0_0_1px_var(--color-ink)]" : "border-line-strong",
              )}
            >
              <input type="checkbox" checked={s[k]} onChange={(e) => set(k, e.target.checked)} className="h-4 w-4 accent-[var(--color-orange)]" />
              {label}
            </label>
          ))}
        </div>
        <ErrorText show={!!touched && !s.pickup && !s.delivery}>Choose at least one.</ErrorText>
      </fieldset>

      <label className="block">
        <Label hint="Optional">Area or address</Label>
        <input className={inputClass} value={s.area} onChange={(e) => set("area", e.target.value)} placeholder="e.g. Wuse 2, Abuja" />
      </label>
    </div>
  );
}

function UploadTile({
  label,
  value,
  onFile,
  onClear,
  shape = "square",
}: {
  label: string;
  value: string | null;
  onFile: (file: File) => void;
  onClear: () => void;
  shape?: "square" | "wide";
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className={cn("relative", shape === "square" ? "h-28 w-28" : "h-28 w-full")}>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="group relative flex h-full w-full flex-col items-center justify-center gap-1.5 overflow-hidden rounded-sm border border-dashed border-line-strong bg-paper text-[12.5px] text-muted transition-colors hover:border-ink hover:text-ink"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <Upload className="h-5 w-5" />
            {label}
          </>
        )}
      </button>
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-ink text-paper"
          aria-label={`Remove ${label.toLowerCase()}`}
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function StepBranding({ s, set }: StepProps) {
  const uploadedCover = s.coverUrl && !COVERS.includes(s.coverUrl) ? s.coverUrl : null;
  return (
    <div className="space-y-8">
      <div>
        <Label hint="Square, at least 400×400">Logo</Label>
        <div className="flex items-center gap-4">
          <UploadTile label="Upload logo" value={s.logoUrl} onFile={async (f) => set("logoUrl", await compressImage(f, 320, "logo"))} onClear={() => set("logoUrl", null)} />
          <p className="max-w-[16rem] text-[13.5px] leading-relaxed text-muted">
            No logo yet? No problem — we’ll use your initials in your brand colour.
          </p>
        </div>
      </div>

      <div>
        <Label hint="Wide photo of your food or space">Cover image</Label>
        <div className="grid grid-cols-4 gap-2">
          {COVERS.map((c, i) => (
            <button
              key={c}
              type="button"
              onClick={() => set("coverUrl", c)}
              aria-label={`Sample cover ${i + 1}`}
              aria-pressed={s.coverUrl === c}
              className={cn(
                "relative h-28 overflow-hidden rounded-sm ring-offset-2 ring-offset-cream transition-shadow",
                s.coverUrl === c ? "ring-2 ring-ink" : "hover:ring-1 hover:ring-line-strong",
              )}
            >
              <Photo src={c} alt="" className="h-full w-full" tone={(["deep", "warm", "gold"] as const)[i]} />
              {s.coverUrl === c && (
                <span className="absolute right-1.5 top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-paper">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
          <UploadTile
            label="Upload"
            shape="wide"
            value={uploadedCover}
            onFile={async (f) => set("coverUrl", await compressImage(f, 1400))}
            onClear={() => set("coverUrl", COVERS[0])}
          />
        </div>
      </div>

      <div>
        <Label hint={<span className="font-mono uppercase">{s.accent}</span>}>Brand colour</Label>
        <div className="flex flex-wrap items-center gap-2.5">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set("accent", c)}
              aria-label={`Use colour ${c}`}
              aria-pressed={s.accent === c}
              className={cn(
                "grid h-10 w-10 place-items-center rounded-full ring-offset-2 ring-offset-cream transition-shadow",
                s.accent === c ? "ring-2 ring-ink" : "",
              )}
              style={{ background: c }}
            >
              {s.accent === c && <Check className="h-4 w-4 text-paper" strokeWidth={3} />}
            </button>
          ))}
          <label className="relative grid h-10 w-10 cursor-pointer place-items-center rounded-full border border-dashed border-line-strong text-muted hover:border-ink" title="Custom colour">
            <span className="text-lg leading-none">+</span>
            <input type="color" value={s.accent} onChange={(e) => set("accent", e.target.value)} className="absolute inset-0 cursor-pointer opacity-0" aria-label="Pick a custom colour" />
          </label>
        </div>
      </div>
    </div>
  );
}

function StepCategory({ s, set, touched }: StepProps) {
  const ideas = CATEGORY_IDEAS[s.businessType] ?? CATEGORY_IDEAS.Other;
  return (
    <div className="space-y-6">
      <label className="block">
        <Label>Category name</Label>
        <input
          className={inputClass}
          value={s.category}
          onChange={(e) => set("category", e.target.value)}
          placeholder="e.g. Rice dishes"
          aria-invalid={touched && !s.category.trim()}
          autoFocus
        />
        <ErrorText show={!!touched && !s.category.trim()}>Give your category a name.</ErrorText>
      </label>
      <div>
        <p className="text-[13px] text-muted">Popular for {s.businessType ? s.businessType.toLowerCase() + "s" : "businesses like yours"}:</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {ideas.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set("category", c)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[13.5px] transition-colors",
                s.category === c ? "border-ink bg-ink text-paper" : "border-line-strong bg-paper hover:border-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepItem({ s, set, touched }: StepProps) {
  const ref = useRef<HTMLInputElement>(null);
  const priceInvalid = !!touched && !(Number(s.itemPrice) > 0);
  return (
    <div className="space-y-6">
      <div>
        <Label hint="Optional, but recommended">Photo</Label>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => ref.current?.click()}
            className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-sm border border-dashed border-line-strong bg-paper text-muted hover:border-ink hover:text-ink"
            aria-label="Upload food photo"
          >
            {s.itemPhoto && !ITEM_PHOTOS.includes(s.itemPhoto) && s.itemPhoto !== photos.ofada ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.itemPhoto} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <span className="flex flex-col items-center gap-1 text-[12px]">
                <ImagePlus className="h-5 w-5" /> Upload
              </span>
            )}
          </button>
          <span className="px-1 text-[12px] text-faint">or use a sample</span>
          {ITEM_PHOTOS.map((p, i) => (
            <button
              key={p}
              type="button"
              onClick={() => set("itemPhoto", p)}
              aria-label={`Sample photo ${i + 1}`}
              aria-pressed={s.itemPhoto === p}
              className={cn(
                "h-14 w-14 overflow-hidden rounded-sm ring-offset-2 ring-offset-cream",
                s.itemPhoto === p && "ring-2 ring-ink",
              )}
            >
              <Photo src={p} alt="" className="h-full w-full" />
            </button>
          ))}
          <input
            ref={ref}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) compressImage(f, 900).then((u) => set("itemPhoto", u));
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_170px]">
        <label className="block">
          <Label>Item name</Label>
          <input
            className={inputClass}
            value={s.itemName}
            onChange={(e) => set("itemName", e.target.value)}
            placeholder="e.g. Jollof rice & chicken"
            aria-invalid={touched && !s.itemName.trim()}
            autoFocus
          />
          <ErrorText show={!!touched && !s.itemName.trim()}>Name your dish.</ErrorText>
        </label>
        <label className="block">
          <Label>Price</Label>
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-muted">₦</span>
            <input
              className={cn(inputClass, "pl-8 tabular-nums")}
              inputMode="numeric"
              value={s.itemPrice ? Number(s.itemPrice).toLocaleString("en-NG") : ""}
              onChange={(e) => set("itemPrice", e.target.value.replace(/\D/g, "").slice(0, 7))}
              placeholder="3,500"
              aria-invalid={priceInvalid}
            />
          </div>
          <ErrorText show={priceInvalid}>Add a price.</ErrorText>
        </label>
      </div>

      <label className="block">
        <Label hint={`${s.itemDescription.length}/140`}>Description</Label>
        <textarea
          className={cn(inputClass, "h-24 resize-none py-3 leading-relaxed")}
          maxLength={140}
          value={s.itemDescription}
          onChange={(e) => set("itemDescription", e.target.value)}
          placeholder="What’s in it? How spicy? How many does it serve?"
        />
      </label>

      <div className="flex items-center justify-between rounded-sm border border-line-strong bg-paper px-4 py-3.5">
        <div>
          <p className="text-[14px] font-medium">Available today</p>
          <p className="text-[12.5px] text-muted">Turn off when it sells out — it’ll show as “Sold out today”.</p>
        </div>
        <Toggle checked={s.itemAvailable} onChange={(v) => set("itemAvailable", v)} label="Item available" />
      </div>
    </div>
  );
}

function StepPreview({
  s,
  preview,
  onEdit,
  onPublished,
}: {
  s: State;
  preview: ReactNode;
  onEdit: () => void;
  onPublished: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const publish = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/business", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: s.businessName,
          type: s.businessType,
          area: s.area,
          whatsapp: s.whatsapp,
          pickup: s.pickup,
          delivery: s.delivery,
          logo: s.logoUrl,
          cover: s.coverUrl,
          accent: s.accent,
          hours: "Open now",
          categories: [{ id: "c1", name: s.category }],
          items: [
            {
              id: "i1",
              categoryId: "c1",
              name: s.itemName,
              description: s.itemDescription,
              price: Number(s.itemPrice) || 0,
              photo: s.itemPhoto,
              available: s.itemAvailable,
              addOns: [],
            },
          ],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Couldn’t publish your menu. Please try again.");
      try {
        sessionStorage.removeItem("menuly:business");
      } catch {}
      onPublished();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn’t publish your menu.");
      setSaving(false);
    }
  };

  const wa = toWhatsAppNumber(s.whatsapp);
  const checks = [
    `${s.businessName} · ${s.businessType}`,
    `Orders go to WhatsApp ${formatPhone(wa)}`,
    s.pickup && s.delivery ? "Pickup and delivery" : s.delivery ? "Delivery only" : "Pickup only",
    `${s.category}: ${s.itemName} at ${naira(Number(s.itemPrice) || 0)}`,
  ];

  return (
    <main className="mx-auto grid w-full max-w-[1240px] flex-1 items-center gap-12 px-5 py-12 md:px-8 lg:grid-cols-[1fr_auto] lg:gap-20 lg:py-16">
      <div className="max-w-[560px]">
        <p className="eyebrow">Step 5 of 5</p>
        <h1 className="display-lg mt-4">Preview your menu.</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-ink-2">
          This is what customers see when they open your link or scan your QR code. When they check out, the
          full order lands in your WhatsApp.
        </p>

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-3 py-3 text-[15px]">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf text-paper">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {c}
            </li>
          ))}
        </ul>

        {error && (
          <p className="mt-5 rounded-sm bg-tomato-soft px-3.5 py-3 text-[14px] text-tomato" role="alert">
            {error}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={publish} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {saving ? "Publishing…" : "Publish my menu"} {!saving && <ArrowRight className="h-4 w-4" />}
          </Button>
          <Button size="lg" variant="secondary" onClick={onEdit} disabled={saving}>
            Keep editing
          </Button>
        </div>
        <p className="mt-4 text-[13.5px] leading-relaxed text-muted">
          After publishing you’ll get your menu link and QR code, and you can add the rest of your dishes from your
          dashboard.
        </p>
      </div>

      <div className="relative mx-auto">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper shadow-[inset_0_0_0_24px_var(--color-cream-2),inset_0_0_0_25px_var(--color-line)]" />
        <div className="relative">{preview}</div>
      </div>
    </main>
  );
}
