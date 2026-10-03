"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Divider, Field } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";
import { GoogleG } from "@/components/landing/icons";

type Errors = Partial<Record<"name" | "business" | "email" | "password", string>>;

export function SignupForm() {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : /\d/.test(password) && /[A-Za-z]/.test(password) ? 3 : 2;

  return (
    <>
      <Button type="button" variant="outline" size="lg" className="w-full">
        <GoogleG className="h-4 w-4" /> Continue with Google
      </Button>
      <Divider>or sign up with email</Divider>
      <form
        noValidate
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const d = new FormData(e.currentTarget);
          const next: Errors = {};
          if (!String(d.get("name")).trim()) next.name = "Tell us your name.";
          if (!String(d.get("business")).trim()) next.business = "What’s your business called?";
          if (!String(d.get("email")).includes("@")) next.email = "Enter a valid email address.";
          if (String(d.get("password")).length < 8) next.password = "Use at least 8 characters.";
          setErrors(next);
          if (Object.keys(next).length) return;
          setLoading(true);
          try {
            sessionStorage.setItem("menuly:business", String(d.get("business")));
          } catch {}
          // TODO: connect to auth API
          setTimeout(() => router.push("/onboarding"), 600);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Your name" name="name" autoComplete="name" placeholder="Tunde Bakare" error={errors.name} />
          <Field label="Business name" name="business" autoComplete="organization" placeholder="Ofada House" error={errors.business} />
        </div>
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@business.com" error={errors.email} />
        <div>
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <div className="mt-2 flex gap-1" aria-hidden>
            {[1, 2, 3].map((n) => (
              <span
                key={n}
                className={
                  "h-1 flex-1 rounded-full transition-colors " +
                  (strength >= n ? (strength === 1 ? "bg-tomato" : strength === 2 ? "bg-gold" : "bg-leaf") : "bg-line")
                }
              />
            ))}
          </div>
        </div>
        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          {loading ? "Setting things up…" : "Create account"}
        </Button>
        <p className="text-center text-[12.5px] leading-relaxed text-muted">
          By continuing you agree to our{" "}
          <Link href="#" className="underline underline-offset-2">Terms</Link> and{" "}
          <Link href="#" className="underline underline-offset-2">Privacy Policy</Link>.
        </p>
      </form>
    </>
  );
}
