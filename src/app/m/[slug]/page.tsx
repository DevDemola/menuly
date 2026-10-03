import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getBusiness } from "@/lib/store";
import { MenuApp } from "@/components/menu-app/MenuApp";

export async function generateMetadata({ params }: PageProps<"/m/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const b = await getBusiness(slug);
  if (!b) return { title: "Menu not found" };
  const cover = b.cover && !b.cover.startsWith("data:") ? [b.cover] : undefined;
  return {
    title: { absolute: `${b.name} — Menu` },
    description: `See the menu and order from ${b.name}${b.area ? ` in ${b.area}` : ""}.`,
    openGraph: { title: `${b.name} — Menu`, description: `Order from ${b.name} on WhatsApp.`, images: cover },
  };
}

export default async function PublicMenuPage({ params }: PageProps<"/m/[slug]">) {
  await connection(); // always read the latest menu
  const { slug } = await params;
  const business = await getBusiness(slug);
  if (!business) notFound();
  return <MenuApp business={business} />;
}
