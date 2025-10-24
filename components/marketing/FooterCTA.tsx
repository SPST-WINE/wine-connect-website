// components/marketing/FooterCTA.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FooterCTA() {
  return (
    <section className="py-16 border-t">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <h3 className="text-2xl font-semibold">
          Ready to discover your next Italian wines?
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Browse the catalog or send a tailored brief in minutes.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild size="lg" className="rounded-2xl">
            <Link href="/catalog">Browse catalog</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-2xl">
            <Link href="/start-brief">Start a brief</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
