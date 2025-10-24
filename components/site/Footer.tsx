// components/site/Footer.tsx
"use client";

import Image from "next/image";
import { useI18n } from "@/components/site/LanguageProvider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="py-8 border-t border-white/10">
      <div className="mx-auto max-w-[1200px] px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-white font-extrabold">
          <Image src="/wc-logo.png" alt="Wine Connect" width={28} height={28} />
          <span className="sr-only">Wine Connect</span>
        </div>
        <small className="text-white/80 leading-tight text-center sm:text-right">
          © {new Date().getFullYear()} Wine Connect — SPST · VAT IT03218840647 · {t.footer.rights}
        </small>
      </div>
    </footer>
  );
}
