// components/marketing/LogosMarquee.tsx
"use client";
import { motion } from "framer-motion";

const logos = ["Campania", "Piedmont", "Tuscany", "Veneto", "Sicily", "Friuli"]; // replace with real logos

export default function LogosMarquee() {
  return (
    <section className="py-6 border-t border-b bg-white/60 dark:bg-white/5">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs uppercase tracking-widest text-zinc-500 mb-4">
          Curated regions & appellations
        </p>
        <div className="overflow-hidden">
          <motion.div
            initial={{ x: 0 }}
            animate={{ x: [0, -600] }}
            transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
            className="flex gap-10 whitespace-nowrap"
          >
            {logos.map((l) => (
              <div
                key={l}
                className="px-4 py-2 text-zinc-600 dark:text-zinc-300 border rounded-2xl"
              >
                {l}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
