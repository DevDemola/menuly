"use client";

import { useState } from "react";
import { MailCheck } from "lucide-react";
import { Field } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";

export function ForgotForm() {
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [error, setError] = useState<string>();

  if (sentTo) {
    return (
      <div className="rounded-sm border border-leaf/30 bg-leaf-soft/50 p-5">
        <MailCheck className="h-6 w-6 text-leaf" />
        <p className="mt-3 font-display text-xl font-semibold tracking-tight">Check your inbox.</p>
        <p className="mt-1.5 text-[14.5px] leading-relaxed text-ink-2">
          If <span className="font-medium text-ink">{sentTo}</span> has a Menuly account, a reset link is on its way.
          It expires in 30 minutes.
        </p>
        <button onClick={() => setSentTo(null)} className="mt-4 text-[14px] font-medium text-ink underline decoration-orange decoration-2 underline-offset-4">
          Use a different email
        </button>
      </div>
    );
  }

  return (
    <form
      noValidate
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const email = String(new FormData(e.currentTarget).get("email"));
        if (!email.includes("@")) return setError("Enter a valid email address.");
        setError(undefined);
        // TODO: connect to password reset API
        setSentTo(email);
      }}
    >
      <Field label="Email" name="email" type="email" autoComplete="email" placeholder="you@business.com" error={error} />
      <Button type="submit" size="lg" className="w-full">
        Send reset link
      </Button>
    </form>
  );
}
