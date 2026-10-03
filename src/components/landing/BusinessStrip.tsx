import { ChefHat, Coffee, CookingPot, Croissant, Store, Wine } from "lucide-react";

const kinds = [
  { label: "Restaurants", Icon: ChefHat },
  { label: "Cafés", Icon: Coffee },
  { label: "Bakeries", Icon: Croissant },
  { label: "Food Vendors", Icon: Store },
  { label: "Caterers", Icon: CookingPot },
  { label: "Bars & Lounges", Icon: Wine },
];

export function BusinessStrip() {
  return (
    <section id="for-businesses" className="scroll-mt-20 border-y border-line bg-paper">
      <div className="container-x flex flex-col gap-6 py-8 xl:flex-row xl:items-center xl:gap-10">
        <p className="shrink-0 font-display text-lg font-semibold leading-tight tracking-tight xl:max-w-[15rem]">
          Built for businesses that serve good food.
        </p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-6 xl:flex xl:flex-1 xl:justify-between xl:gap-0">
          {kinds.map(({ label, Icon }, i) => (
            <li key={label} className="flex items-center gap-2.5 whitespace-nowrap xl:px-4">
              {i > 0 && <span className="hidden h-6 w-px -translate-x-4 bg-line xl:block" aria-hidden />}
              <Icon className="h-[18px] w-[18px] text-orange" strokeWidth={1.75} />
              <span className="text-[15px] font-medium text-ink-2">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
