// components/site/Header.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Languages } from "lucide-react";
import { useI18n } from "@/components/site/LanguageProvider";
import { Button } from "@/components/ui/button";

export default function Header() {
  const { lang, t, toggleLang } = useI18n();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
      <div className="mx-auto max-w-[1200px] px-5 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 text-white font-extrabold">
          <Image src="/wc-logo.png" alt="Wine Connect" width={32} height={32} priority />
          <span className="hidden sm:inline">Wine Connect</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-white/80">
          <Link href="/catalog" className="hover:text-white">{t.header.nav.catalog}</Link>
          <Link href="/buyers" className="hover:text-white">{t.header.nav.buyers}</Link>
          <Link href="/wineries" className="hover:text-white">{t.header.nav.wineries}</Link>
          <a href="#how" className="hover:text-white">{t.header.nav.how}</a>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="md" className="rounded-full bg-white text-black">
            <Link href="/login">{t.header.enter}</Link>
          </Button>
          <button
            onClick={toggleLang}
            className="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-2 text-sm hover:bg-white/5 text-white/90"
            aria-label="Toggle language"
          >
            <Languages size={14} /> {lang.toUpperCase()}
          </button>
        </div>
      </div>
    </header>
  );
}
