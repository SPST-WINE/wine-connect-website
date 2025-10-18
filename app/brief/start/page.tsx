// app/brief/start/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import ClientBriefWizard from "./Client";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-5">
      {children}
    </div>
  );
}

export default async function Page() {
  const supa = createSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen" style={{ background: BG }}>
        <header className="h-14 flex items-center justify-between px-5">
          <Link href="/buyer-home" className="flex items-center gap-2 text-white">
            <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
            <span className="font-semibold">Wine Connect</span>
          </Link>
        </header>
        <main className="px-5">
          <div className="mx-auto max-w-3xl py-10">
            <SectionCard>
              <div className="text-center text-white/80">
                Please <a className="underline" href="/login">sign in</a> to start your brief.
              </div>
            </SectionCard>
          </div>
        </main>
        <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
          © {new Date().getFullYear()} Wine Connect — SPST
        </footer>
      </div>
    );
  }

  const { data: buyer } = await supa
    .from("buyers")
    .select("id, full_name")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const buyerId = buyer?.id ?? null;
  const fullName = (buyer as any)?.full_name ?? null;

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <header className="h-14 flex items-center justify-between px-5">
        <Link href="/buyer-home" className="flex items-center gap-2 text-white">
          <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
          <span className="font-semibold">Wine Connect</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link className="text-white/80 hover:text-white" href="/catalog">Catalog</Link>
          <Link className="text-white/80 hover:text-white" href="/cart/samples">Sample Cart</Link>
          <Link className="text-white/80 hover:text-white" href="/orders">Orders</Link>
        </nav>
      </header>

      <main className="px-5">
        <div className="mx-auto max-w-3xl py-8">
          {/* Il wizard vero e proprio è client-side */}
          <ClientBriefWizard buyerId={buyerId} fullName={fullName} />
        </div>
      </main>

      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}
