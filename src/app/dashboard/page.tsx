import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getBusiness, getOrders } from "@/lib/store";
import { SESSION_COOKIE } from "@/lib/session";
import { DashboardApp } from "@/components/dashboard/DashboardApp";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const slug = (await cookies()).get(SESSION_COOKIE)?.value;
  const business = slug ? await getBusiness(slug) : null;
  if (!business || business.demo) redirect("/onboarding");
  const orders = await getOrders(business.slug);
  const welcome = (await searchParams).welcome === "1";
  return <DashboardApp initial={business} orders={orders} welcome={welcome} />;
}
