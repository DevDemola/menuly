"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Divider, Field } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";
import { GoogleG } from "@/components/landing/icons";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <>
      <Button type="button" variant="outline" size="lg" className="w-full">
        <GoogleG className="h-4 w-4" /> Continue with Google
      </Button>
      <Divider>or with email</Divider>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          if (!String(data.get("email")).includes("@")) return setError("Enter the email you signed up with.");
          setError(null);
          setLoading(true);
          // TODO: connect to auth API
          setTimeout(() => router.push("/dashboard"), 600);
        }}
        noValidate
      >
        <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@business.com" error={error ?? undefined} required />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Your password"
          required
          aside={
            <Link href="/forgot-password" className="text-[13px] text-muted hover:text-ink">
              Forgot password?
            </Link>
          }
        />
        <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </Button>
      </form>
    </>
  );
}
