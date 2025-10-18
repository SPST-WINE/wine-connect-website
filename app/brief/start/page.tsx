// app/brief/start/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import ClientBriefWizard from "./Client";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

export default async function Page() {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  let buyerId: string | null = null;
  let fullName: string | null = null;

  if (user) {
    const { data: buyer } = await supa
      .from("buyers")
      .select("id, full_name")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    buyerId = buyer?.id ?? null;
    fullName = (buyer as any)?.full_name ?? null;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>
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

      {/* La card è centrata verticalmente/orizzontalmente, con spazio per il footer */}
      <main className="flex-1 px-5 grid place-items-center">
        <div className="w-full max-w-3xl">
          <ClientBriefWizard buyerId={buyerId} fullName={fullName} />
        </div>
      </main>

      <footer className="py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}
