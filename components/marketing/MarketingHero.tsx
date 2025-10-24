// components/marketing/MarketingHero.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export default function MarketingHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900 dark:to-black" />
      <div className="mx-auto max-w-6xl px-6 pt-24 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-zinc-600 dark:text-zinc-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Buyer-first · Logistics built-in</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl"
        >
          Source Italian wines.{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-600">
            Streamlined
          </span>
          .
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mt-5 max-w-2xl text-zinc-600 dark:text-zinc-300"
        >
          Match with export-ready wineries, request standard sample kits, and
          handle compliance+shipping in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <Button asChild size="lg" className="rounded-2xl">
            <Link href="/catalog">Browse catalog</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-2xl">
            <Link href="/start-brief" className="inline-flex items-center gap-1">
              Tailored brief <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 text-xs text-zinc-500 dark:text-zinc-400"
        >
          <div>EU & US compliant</div>
          <div>Samples → Orders → Logistics</div>
          <div>Excise & customs handled</div>
          <div>Dedicated buyer support</div>
        </motion.div>
      </div>
    </section>
  );
}
