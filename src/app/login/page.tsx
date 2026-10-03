import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back."
      subtitle="Log in to update your menu and see today’s orders."
      footer={
        <>
          New to Menuly?{" "}
          <Link href="/signup" className="font-medium text-ink underline decoration-orange decoration-2 underline-offset-4">
            Create your menu
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
