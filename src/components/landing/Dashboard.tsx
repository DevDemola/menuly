import { DashboardMock } from "@/components/dashboard/DashboardMock";

const notes = [
  { t: "Orders, as they happen", b: "Every order arrives on your WhatsApp and is saved here too, so nothing gets lost in the chat." },
  { t: "Know what sells", b: "Menu views, popular dishes and today’s revenue, without opening a spreadsheet." },
  { t: "Change the menu in seconds", b: "Prices, photos and availability update everywhere the moment you save." },
];

export function Dashboard() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow">For you</p>
            <h2 className="display-lg mt-4 max-w-[15ch]">Your menu. Your business. One place.</h2>
          </div>
          <p className="max-w-[24rem] text-[17px] leading-relaxed text-ink-2">
            A dashboard built for a busy Saturday, not a board meeting. Try the switches — they work.
          </p>
        </div>

        <div className="mt-14">
          <DashboardMock />
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {notes.map((n) => (
            <div key={n.t} className="border-t border-ink pt-4">
              <p className="font-display text-xl font-semibold tracking-tight">{n.t}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{n.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
