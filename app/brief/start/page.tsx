// app/brief/start/page.tsx
export const dynamic = "force-dynamic";

import { createSupabaseServer } from "@/lib/supabase/server";
import ClientBriefWizard from "./Client";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

export default async function Page() {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  // Not logged-in state
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col text-white" style={{ background: BG }}>
        <SiteHeader />
        <main className="flex-1 px-5 grid place-items-center">
          <div className="w-full max-w-3xl rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-5 text-center text-white/80">
            Please <a className="underline" href="/login">sign in</a> to start your brief.
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // Buyer
  const { data: buyer } = await supa
    .from("buyers")
    .select("id, contact_name, company_name, email")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const buyerId = buyer?.id ?? null;
  const fullName =
    (buyer?.contact_name?.trim() || "") ||
    (buyer?.company_name?.trim() || "") ||
    (buyer?.email?.split("@")[0] || "") ||
    null;

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: BG }}>
      {/* GLOBAL HEADER */}
      <SiteHeader />

      {/* Card centrata, footer sempre in basso */}
      <main className="flex-1 px-5 grid place-items-center">
        <div className="w-full max-w-3xl">
          <ClientBriefWizard buyerId={buyerId} fullName={fullName} />
        </div>
      </main>

      {/* GLOBAL FOOTER */}
      <SiteFooter />
    </div>
  );
}
