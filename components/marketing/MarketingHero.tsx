// components/marketing/MarketingHero.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/site/LanguageProvider";
import { WC_COLORS } from "@/lib/theme";

export default function MarketingHero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden py-14" id="hero">
      {/* soft glows */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[620px] w-[620px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(60% 60% at 35% 35%, ${WC_COLORS.PINK}55, transparent 60%)` }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.35, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="pointer-events-none absolute -bottom-24 right-1/2 translate-x-1/2 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(60% 60% at 70% 70%, ${WC_COLORS.BLUE_SOFT}66, transparent 60%)` }}
      />

      <div className="mx-auto max-w-[1200px] px-5">
        <div className="text-center mb-8">
          <span className="inline-block text-xs tracking-wider uppercase text-white/70">{t.hero.kicker}</span>
          <h1 className="mt-2 text-[30px] sm:text-[40px] md:text-[56px] font-black leading-[1.05]">
            {t.hero.titleA}
            <span
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(90deg, ${WC_COLORS.PINK}, ${WC_COLORS.BLUE_SOFT})` }}
            >
              {t.hero.titleB}
            </span>
          </h1>
          <p className="mt-3 mx-auto max-w-[70ch] text-white/80 text-[15px] sm:text-base">{t.hero.desc}</p>
        </div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild size="lg" className="rounded-2xl">
            <Link href="/catalog">{t.hero.ctaCatalog}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-2xl">
            <Link href="/start-brief">{t.hero.ctaBrief}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
