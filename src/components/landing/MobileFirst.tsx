import { Globe, Link2, MessageCircle, QrCode, Search } from "lucide-react";
import { Instagram, TikTok } from "./icons";
import { Phone } from "@/components/menu/Phone";
import { MenuHomeScreen } from "@/components/menu/MenuScreens";
import { Photo } from "@/components/ui/Photo";
import { demoBusiness } from "@/lib/menu-data";
import { photos } from "@/lib/images";

const channels = [
  { name: "WhatsApp", how: "Status, broadcast lists, and the reply you send 40 times a day.", Icon: MessageCircle },
  { name: "Instagram", how: "Link in bio, story link stickers, DMs.", Icon: Instagram },
  { name: "TikTok", how: "The link in your profile when a video takes off.", Icon: TikTok },
  { name: "QR codes", how: "Tables, counters, packaging and flyers.", Icon: QrCode },
  { name: "Google", how: "Add it to your Business Profile as your menu link.", Icon: Search },
  { name: "Direct links", how: "SMS, email, X, your website — anywhere a link works.", Icon: Link2 },
];

export function MobileFirst() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-20">
        <div>
          <p className="eyebrow">Mobile-first</p>
          <h2 className="display-lg mt-4 max-w-[15ch]">Made for the way your customers actually order.</h2>
          <p className="mt-6 max-w-[32rem] text-[17px] leading-relaxed text-ink-2">
            Most of your customers will meet your menu on a phone, inside another app. Menuly opens
            instantly from wherever they tap — no download, no sign-up.
          </p>

          <ul className="mt-10 grid border-t border-line sm:grid-cols-2">
            {channels.map(({ name, how, Icon }, i) => (
              <li
                key={name}
                className={
                  "flex gap-4 border-b border-line py-5 " +
                  (i % 2 === 0 ? "sm:border-r sm:pr-6" : "sm:pl-6")
                }
              >
                <Icon className="mt-1 h-5 w-5 shrink-0 text-orange" strokeWidth={1.75} />
                <div>
                  <p className="font-display text-xl font-semibold tracking-tight">{name}</p>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-muted">{how}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto">
          <Phone lightStatus>
            <MenuHomeScreen activeCategory={0} />
          </Phone>
          {/* link preview, as it appears when shared in a chat */}
          <div className="absolute -left-10 top-[300px] w-[230px] overflow-hidden rounded-[12px] bg-paper shadow-lift ring-1 ring-black/5 sm:-left-28">
            <Photo src={photos.cover} alt="" className="h-[92px] w-full" tone="deep" />
            <div className="p-3">
              <p className="text-[13px] font-semibold leading-tight">{demoBusiness.name} — Menu</p>
              <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-muted">
                Jollof, grills, small chops and more. Order for pickup or delivery in {demoBusiness.area.split(",")[0]}.
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-[11px] text-faint">
                <Globe className="h-3 w-3" /> menuly.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
