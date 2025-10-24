// app/page.tsx
export const dynamic = "force-static";

import type { Metadata } from "next";
import MarketingHero from "@/components/marketing/MarketingHero";
import LogosMarquee from "@/components/marketing/LogosMarquee";
import StatsStrip from "@/components/marketing/StatsStrip";
import ValueGrid from "@/components/marketing/ValueGrid";
import HowItWorks from "@/components/marketing/HowItWorks";
import CatalogPreview from "@/components/marketing/CatalogPreview";
import TailoredBriefCTA from "@/components/marketing/TailoredBriefCTA";
import Testimonials from "@/components/marketing/Testimonials";
import FAQs from "@/components/marketing/FAQs";
import FooterCTA from "@/components/marketing/FooterCTA";

export const metadata: Metadata = {
  title: "Wine Connect — Source Italian wines. Streamlined.",
  description:
    "Match with export-ready Italian wineries, request samples in one click, and ship compliantly with integrated logistics.",
  openGraph: {
    title: "Wine Connect — Source Italian wines. Streamlined.",
    description:
      "Match with export-ready Italian wineries, request samples in one click, and ship compliantly with integrated logistics.",
    url: "https://www.wearewineconnect.com/",
    siteName: "Wine Connect",
  },
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <MarketingHero />
      <LogosMarquee />
      <StatsStrip />
      <ValueGrid />
      <HowItWorks />
      <CatalogPreview />
      <TailoredBriefCTA />
      <Testimonials />
      <FAQs />
      <FooterCTA />
    </main>
  );
}
