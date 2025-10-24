// app/page.tsx
export const dynamic = "force-static";

import type { Metadata } from "next";
import { LanguageProvider } from "@/components/site/LanguageProvider";
import Header from "@/components/site/Header";
import MarketingHero from "@/components/marketing/MarketingHero";
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
    <LanguageProvider defaultLang="it">
      <main
        className="font-sans text-slate-100 selection:bg-[color:var(--wc)]/30 min-h-screen"
        style={
          {
            // stesso background della buyer-home
            background: homepageGradient(),
            // usato per i badge/CTA
            ["--wc" as any]: WC_COLORS.PINK,
          } as React.CSSProperties
        }
      >
        <Header />
        <MarketingHero />
        {/* Puoi aggiungere qui gli altri blocchi componentizzati (LogosMarquee, StatsStrip, ValueGrid, ...) */}
        <Footer />
      </main>
    </LanguageProvider>
  );
}
