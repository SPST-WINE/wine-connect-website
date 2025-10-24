// components/marketing/TailoredBriefCTA.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TailoredBriefCTA() {
  return (
    <section className="py-16 border-y">
      <div className="mx-auto max-w-6xl px-6 grid gap-6 md:grid-cols-2 items-center">
        <div>
          <h3 className="text-2xl font-semibold">Short on time? Send a brief.</h3>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Describe what you need (styles, price range, certifications, quantities, markets). We’ll come back
            with a shortlist and a sample kit proposal.
          </p>
        </div>
        <div className="md:text-right">
          <Button asChild size="lg" className="rounded-2xl">
            <Link href="/start-brief">Start a brief</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
