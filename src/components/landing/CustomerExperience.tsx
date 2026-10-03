import { Phone } from "@/components/menu/Phone";
import { MenuCheckoutScreen, MenuHomeScreen, MenuItemScreen } from "@/components/menu/MenuScreens";

const stages = [
  { k: "Browse", body: "Opening status, categories and photos up front. No app to download." },
  { k: "Choose", body: "Every dish has the detail people ask about — and the add-ons they’ll want." },
  { k: "Order", body: "Name, phone and address — then the order goes straight to the business on WhatsApp." },
];

export function CustomerExperience() {
  return (
    <section className="overflow-hidden bg-ink py-20 text-paper md:py-28">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="eyebrow !text-paper/50">For your customers</p>
            <h2 className="display-lg mt-4 max-w-[14ch]">A menu customers actually enjoy using.</h2>
          </div>
          <p className="max-w-[28rem] text-[17px] leading-relaxed text-paper/70">
            Fast on cheap data, readable in the sun, and as easy as scrolling Instagram.
            It feels like a proper food app — with your name on it.
          </p>
        </div>

        <div className="no-scrollbar -mx-5 mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
          {stages.map((s, i) => (
            <div key={s.k} className={"flex snap-center flex-col items-center md:items-stretch " + (i === 1 ? "md:translate-y-12" : "")}>
              <div className="flex justify-center">
                <Phone lightStatus={i < 2}>
                  {i === 0 && <MenuHomeScreen />}
                  {i === 1 && <MenuItemScreen />}
                  {i === 2 && <MenuCheckoutScreen />}
                </Phone>
              </div>
              <div className="mt-8 w-[280px] md:mx-auto">
                <p className="flex items-baseline gap-3">
                  <span className="font-display text-sm tabular-nums text-orange">0{i + 1}</span>
                  <span className="font-display text-2xl font-semibold tracking-tight">{s.k}</span>
                </p>
                <p className="mt-2 text-[15px] leading-relaxed text-paper/65">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
