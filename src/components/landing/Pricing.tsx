import { Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const plans = [
  {
    name: "Starter",
    price: "Free",
    per: "",
    blurb: "For getting your menu online today.",
    cta: "Start free",
    features: ["1 digital menu", "Up to 30 items", "Menu link & QR code", "Availability toggles", "Menuly branding"],
  },
  {
    name: "Pro",
    price: "₦5,000",
    per: "/month",
    blurb: "For businesses taking orders every day.",
    cta: "Start with Pro",
    featured: true,
    features: [
      "Unlimited items & categories",
      "Cart & WhatsApp ordering",
      "Add-ons and options",
      "Your logo, cover & colours",
      "Order management",
      "Basic analytics",
    ],
  },
  {
    name: "Business",
    price: "₦15,000",
    per: "/month",
    blurb: "For busy kitchens and multiple locations.",
    cta: "Choose Business",
    features: [
      "Everything in Pro",
      "Up to 3 locations",
      "Team members & roles",
      "Advanced analytics",
      "Remove Menuly branding",
      "Priority support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="scroll-mt-16 border-t border-line bg-paper py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">Pricing</p>
            <h2 className="display-lg mt-4">
              Start free.
              <span className="mt-2 block text-[0.6em] leading-[1.05] tracking-[-0.035em] text-muted">
                Upgrade when you need more.
              </span>
            </h2>
          </div>
          <p className="max-w-[24rem] text-[15px] leading-relaxed text-muted">
            Menuly is young, and pricing may evolve as the product grows. If it changes, we’ll tell you
            early — and the free plan stays free.
          </p>
        </div>

        <div className="mt-14 grid border-y border-ink md:grid-cols-3">
          {plans.map((p, i) => (
            <div
              key={p.name}
              className={cn(
                "relative flex flex-col px-0 py-10 md:px-8",
                i > 0 && "border-t border-line md:border-l md:border-t-0",
                i === 0 && "md:pl-0",
                i === 2 && "md:pr-0",
                p.featured && "md:bg-cream/70",
              )}
            >
              {p.featured && <span className="absolute inset-x-0 -top-px h-1 bg-orange md:inset-x-0" />}
              <div className="flex items-center justify-between">
                <p className="font-display text-2xl font-semibold tracking-tight">{p.name}</p>
                {p.featured && (
                  <span className="rounded-[4px] bg-orange px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-paper">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-1 text-[15px] text-muted">{p.blurb}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className="font-display text-[40px] font-bold tabular-nums tracking-[-0.04em] lg:text-5xl">{p.price}</span>
                <span className="text-muted">{p.per}</span>
              </p>
              <ul className="mt-7 space-y-3 text-[15px]">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-10">
                <ButtonLink href="/signup" variant={p.featured ? "primary" : "secondary"} className="w-full">
                  {p.cta}
                </ButtonLink>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted">Prices in Nigerian naira. Cancel any time. No setup fees.</p>
      </div>
    </section>
  );
}
