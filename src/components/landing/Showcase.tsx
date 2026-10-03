import { Phone } from "@/components/menu/Phone";
import { MenuItemScreen } from "@/components/menu/MenuScreens";

type Note = { n: string; title: string; body: string };

const left: Note[] = [
  { n: "01", title: "Business branding", body: "Your logo, cover photo and colour. It looks like you, not like us." },
  { n: "02", title: "Categories", body: "Rice, grills, small chops, drinks — customers jump straight to what they want." },
  { n: "03", title: "Food images", body: "Let the food sell itself. Photos sit next to every dish." },
  { n: "04", title: "Prices & descriptions", body: "Clear prices in naira, short descriptions, no guesswork." },
];

const right: Note[] = [
  { n: "05", title: "Add-ons", body: "Extra plantain, more protein, a cold drink. Upsells that feel helpful." },
  { n: "06", title: "Availability", body: "Sold out? Flip a switch. The menu updates everywhere at once." },
  { n: "07", title: "Cart", body: "Customers build their order as they browse — no back-and-forth." },
  { n: "08", title: "Always current", body: "Edit once. Every link and every QR code shows the latest version." },
];

function NoteBlock({ note, align }: { note: Note; align: "left" | "right" }) {
  return (
    <div className={align === "left" ? "lg:text-right" : ""}>
      <div className={"flex items-baseline gap-3 " + (align === "left" ? "lg:flex-row-reverse" : "")}>
        <span className="font-display text-sm font-semibold tabular-nums text-orange">{note.n}</span>
        <h3 className="font-display text-xl font-semibold tracking-tight">{note.title}</h3>
      </div>
      <p className="mt-1.5 text-[15px] leading-relaxed text-ink-2">{note.body}</p>
    </div>
  );
}

export function Showcase() {
  return (
    <section id="product" className="scroll-mt-16 py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <h2 className="display-lg max-w-[16ch]">
            Everything your menu needs.{" "}
            <span className="text-muted">Nothing it doesn’t.</span>
          </h2>
          <p className="max-w-[24rem] text-[17px] leading-relaxed text-ink-2">
            Menuly is deliberately simple. The features that help customers decide — and
            nothing that slows you down.
          </p>
        </div>

        <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-14">
          <div className="order-2 grid gap-8 sm:grid-cols-2 lg:order-1 lg:grid-cols-1 lg:gap-12">
            {left.map((n) => (
              <NoteBlock key={n.n} note={n} align="left" />
            ))}
          </div>

          <div className="order-1 flex justify-center lg:order-2">
            <div className="relative">
              {/* A plate, set under the phone */}
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 sm:h-[420px] sm:w-[420px] -translate-y-1/2 rounded-full bg-paper shadow-[inset_0_0_0_22px_var(--color-cream-2),inset_0_0_0_23px_var(--color-line)]" />
              <Phone className="relative" lightStatus>
                <MenuItemScreen />
              </Phone>
            </div>
          </div>

          <div className="order-3 grid gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:gap-12">
            {right.map((n) => (
              <NoteBlock key={n.n} note={n} align="right" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
