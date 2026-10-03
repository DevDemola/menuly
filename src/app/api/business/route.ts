import { NextResponse, type NextRequest } from "next/server";
import { createBusiness, getBusiness, updateBusiness } from "@/lib/store";
import { sanitizeBusiness } from "@/lib/validate";
import { SESSION_COOKIE } from "@/lib/session";

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

/** Create a business (end of onboarding). */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { data, error } = sanitizeBusiness(body);
  if (!data) return NextResponse.json({ error }, { status: 400 });

  const business = await createBusiness(data);
  const res = NextResponse.json({ slug: business.slug });
  res.cookies.set(SESSION_COOKIE, business.slug, cookieOpts);
  return res;
}

/** Update the signed-in business (dashboard). */
export async function PUT(req: NextRequest) {
  const slug = req.cookies.get(SESSION_COOKIE)?.value;
  if (!slug || !(await getBusiness(slug))) {
    return NextResponse.json({ error: "Your session has expired. Please set up your menu again." }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const { data, error } = sanitizeBusiness(body);
  if (!data) return NextResponse.json({ error }, { status: 400 });

  const business = await updateBusiness(slug, data);
  if (!business) return NextResponse.json({ error: "Business not found." }, { status: 404 });
  return NextResponse.json({ business });
}
