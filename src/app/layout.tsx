import type { Metadata, Viewport } from "next";
import "@fontsource-variable/bricolage-grotesque/opsz.css";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Menuly — Your menu, beautifully served.",
    template: "%s · Menuly",
  },
  description:
    "Create a beautiful digital menu for your food business, share it anywhere with one link or QR code, and give customers a simpler way to discover and order your food.",
};

export const viewport: Viewport = {
  themeColor: "#f6efe3",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
