import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotForm } from "./ForgotForm";

export const metadata: Metadata = { title: "Reset your password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset your password."
      subtitle="Enter the email you use for Menuly and we’ll send you a link to set a new password."
      footer={
        <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-ink hover:text-orange">
          <ArrowLeft className="h-4 w-4" /> Back to log in
        </Link>
      }
    >
      <ForgotForm />
    </AuthShell>
  );
}
