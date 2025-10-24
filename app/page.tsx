// app/page.tsx
export const dynamic = "force-static";

import type { Metadata } from "next";
import { LanguageProvider } from "@/components/site/LanguageProvider";
import Header from "@/components/site/Header";
import MarketingHero from "@/components/marketing/MarketingHero";
import LogosMarquee from "@/components/marketing/LogosMarquee";
import StatsStrip from "@/components/marketing/StatsStrip";
import ValueGrid from "@/components/marketing/ValueGrid";
import HowItWorks from "@/components/marketing/HowItWorks";
import CatalogPreview from "@/components/marketing/CatalogPreview";
import TailoredBriefCTA from "@/components/marketing/TailoredBriefCTA";
import Testimonials from "@/components/marketing/Testimonials";
import FAQs from "@/components/marketing/FAQs";
import Footer from "@/components/site/Footer";
import { homepageGradient, WC_COLORS } from "@/lib/theme";

export const metadata: Metadata = {
  title: "Wine Connect — Source Italian wines. Streamlined.",
  description:
    "Match with export-ready Italian wineries, request samples in one click, and ship compliantly with integrated logistics.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <LanguageProvider defaultLang="en">
      <main
        className="font-sans text-slate-100 selection:bg-[color:var(--wc)]/30 min-h-screen"
        style={
          {
            background: homepageGradient(),
            ["--wc" as any]: WC_COLORS.PINK,
          } as React.CSSProperties
        }
      >
        <Header />
        <MarketingHero />
        <LogosMarquee />
        <StatsStrip />
        <ValueGrid />
        <HowItWorks />
        <CatalogPreview />
        <TailoredBriefCTA />
        <Testimonials />
        <FAQs />
        <Footer />
      </main>
    </LanguageProvider>
  );
}
