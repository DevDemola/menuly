import type { Metadata } from "next";
import { Suspense } from "react";
import { Onboarding } from "./Onboarding";

export const metadata: Metadata = { title: "Set up your menu" };

export default function OnboardingPage() {
  return (
    <Suspense>
      <Onboarding />
    </Suspense>
  );
}
