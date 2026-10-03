import {
  ChartColumn,
  ExternalLink,
  LayoutDashboard,
  QrCode as QrIcon,
  ReceiptText,
  Settings,
  UtensilsCrossed,
} from "lucide-react";
import { LogoMark } from "@/components/ui/Logo";
import { AvailabilityList } from "./AvailabilityList";
import { naira } from "@/lib/menu-data";

const orders = [
  { id: "#1042", who: "Adaeze O.", items: "Jollof & Chicken, 2× Chapman", total: 8500, status: "New" },
  { id: "#1041", who: "Kunle B.", items: "Suya Platter, Small Chops Box", total: 9800, status: "Preparing" },
  { id: "#1040", who: "Halima S.", items: "Ofada Rice & Ayamase", total: 5200, status: "Ready" },
  { id: "#1039", who: "Tobi A.", items: "2× Jollof & Chicken", total: 9000, status: "Completed" },
] as const;

const statusStyle: Record<string, string> = {
  New: "bg-orange-soft text-orange-deep",
  Preparing: "bg-gold-soft text-[#8a5a0b]",
  Ready: "bg-leaf-soft text-leaf",
  Completed: "bg-cream-2 text-muted",
};

const popular = [
  { name: "Party Jollof & Chicken", sold: 64 },
  { name: "Beef Suya Platter", sold: 41 },
  { name: "Small Chops Box", sold: 33 },
  { name: "House Chapman", sold: 28 },
];

const nav = [
  { label: "Overview", Icon: LayoutDashboard, active: true },
  { label: "Orders", Icon: ReceiptText, badge: 3 },
  { label: "Menu", Icon: UtensilsCrossed },
  { label: "QR & sharing", Icon: QrIcon },
  { label: "Analytics", Icon: ChartColumn },
  { label: "Settings", Icon: Settings },
];

export function DashboardMock() {
  const max = Math.max(...popular.map((p) => p.sold));
  return (
    <div className="overflow-hidden rounded-[10px] border border-line-strong/70 bg-paper text-ink shadow-lift">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden w-[200px] shrink-0 flex-col border-r border-line bg-cream/60 p-4 md:flex">
          <div className="flex items-center gap-2">
            <LogoMark className="h-6 w-6" />
            <span className="font-display text-[17px] font-bold tracking-[-0.04em]">menuly</span>
          </div>
          <ul className="mt-6 space-y-0.5 text-[13px]">
            {nav.map(({ label, Icon, active, badge }) => (
              <li
                key={label}
                className={
                  "flex items-center gap-2.5 rounded-[6px] px-2.5 py-2 " +
                  (active ? "bg-paper font-semibold shadow-card" : "text-ink-2")
                }
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="rounded-full bg-orange px-1.5 text-[10.5px] font-semibold text-paper">{badge}</span>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-auto flex items-center gap-2 border-t border-line pt-4">
            <span className="grid h-8 w-8 place-items-center rounded-[7px] bg-orange font-display text-xs font-bold text-paper">OH</span>
            <div className="leading-tight">
              <p className="text-[12.5px] font-semibold">Ofada House</p>
              <p className="text-[11px] text-muted">Pro plan</p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[12px] text-muted">Saturday, 3 October</p>
              <p className="font-display text-[22px] font-bold tracking-[-0.03em]">Good afternoon, Tunde</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-line px-3 py-1.5 text-[12.5px] font-medium">
              View live menu <ExternalLink className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* KPIs */}
          <dl className="mt-5 grid grid-cols-3 divide-x divide-line rounded-[8px] border border-line">
            {[
              { k: "Today’s orders", v: "38", d: "+6 vs last Sat" },
              { k: "Menu views", v: "1,204", d: "+12% this week" },
              { k: "Revenue today", v: naira(186400), d: "Paid & pending" },
            ].map((s) => (
              <div key={s.k} className="p-3 md:p-4">
                <dt className="text-[11.5px] text-muted">{s.k}</dt>
                <dd className="mt-1 font-display text-[19px] font-bold tabular-nums tracking-[-0.02em] md:text-[26px]">{s.v}</dd>
                <dd className="mt-0.5 hidden text-[11px] text-leaf sm:block">{s.d}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
            {/* Orders */}
            <div className="min-w-0">
              <div className="flex items-baseline justify-between">
                <p className="text-[13.5px] font-semibold">Recent orders</p>
                <p className="text-[12px] text-muted">See all</p>
              </div>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full text-left text-[12.5px]">
                  <thead className="text-[11px] uppercase tracking-wider text-faint">
                    <tr className="border-b border-line">
                      <th className="py-2 font-medium">Order</th>
                      <th className="hidden py-2 font-medium sm:table-cell">Items</th>
                      <th className="py-2 text-right font-medium">Total</th>
                      <th className="py-2 pl-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {orders.map((o) => (
                      <tr key={o.id}>
                        <td className="py-2.5 pr-3">
                          <span className="block font-semibold tabular-nums">{o.id}</span>
                          <span className="text-[11.5px] text-muted">{o.who}</span>
                        </td>
                        <td className="hidden max-w-[180px] truncate py-2.5 pr-3 text-ink-2 sm:table-cell">{o.items}</td>
                        <td className="py-2.5 text-right font-medium tabular-nums">{naira(o.total)}</td>
                        <td className="py-2.5 pl-4">
                          <span className={"rounded-[4px] px-1.5 py-0.5 text-[11px] font-semibold " + statusStyle[o.status]}>
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-6 text-[13.5px] font-semibold">Popular this week</p>
              <ul className="mt-2 space-y-2.5">
                {popular.map((p) => (
                  <li key={p.name} className="grid grid-cols-[minmax(0,150px)_1fr_auto] items-center gap-3 text-[12.5px]" title={`${p.name}: ${p.sold} sold`}>
                    <span className="truncate text-ink-2">{p.name}</span>
                    <span className="h-2 rounded-r-[4px] bg-orange" style={{ width: `${(p.sold / max) * 100}%` }} />
                    <span className="w-8 text-right tabular-nums text-muted">{p.sold}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Menu management */}
            <div className="min-w-0 rounded-[8px] border border-line p-3.5">
              <div className="flex items-baseline justify-between">
                <p className="text-[13.5px] font-semibold">Menu · availability</p>
                <p className="text-[12px] text-orange">Edit menu</p>
              </div>
              <div className="mt-1">
                <AvailabilityList limit={5} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
