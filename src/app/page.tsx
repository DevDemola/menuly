import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { BusinessStrip } from "@/components/landing/BusinessStrip";
import { Problem } from "@/components/landing/Problem";
import { Showcase } from "@/components/landing/Showcase";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CustomerExperience } from "@/components/landing/CustomerExperience";
import { Dashboard } from "@/components/landing/Dashboard";
import { QrSection } from "@/components/landing/QrSection";
import { Features } from "@/components/landing/Features";
import { MobileFirst } from "@/components/landing/MobileFirst";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCta } from "@/components/landing/FinalCta";
import { Footer } from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <BusinessStrip />
        <Problem />
        <Showcase />
        <HowItWorks />
        <CustomerExperience />
        <Dashboard />
        <QrSection />
        <Features />
        <MobileFirst />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
