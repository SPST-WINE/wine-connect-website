import { createSupabaseServer } from "@/lib/supabase/server";
import Addresses from "@/components/profile/Addresses";
import Compliance from "@/components/profile/Compliance";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          You must <a className="underline" href="/login">sign in</a>.
        </div>
      </main>
    );
  }

  const { data: buyer } = await supa
    .from("buyers")
    .select("id, company_name, contact_name, email, country, compliance_mode")
    .eq("auth_user_id", user.id)
    .single();

  if (!buyer) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          Buyer profile not found.
        </div>
      </main>
    );
  }

  const { data: addresses } = await supa
    .from("addresses")
    .select("id,label,address,city,zip,country,is_default")
    .eq("buyer_id", buyer.id)
    .order("is_default", { ascending: false });

  const { data: compl } = await supa
    .from("compliance_records")
    .select("id, mode, documents")
    .eq("buyer_id", buyer.id)
    .maybeSingle();

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-10">
      <header className="mb-6">
        <div className="text-xs uppercase tracking-wide text-neutral-400">Profile & compliance</div>
        <h1 className="text-2xl font-semibold">Your profile</h1>
        <p className="text-sm text-neutral-400 mt-1">
          {buyer.company_name} — {buyer.email}
        </p>
      </header>

      {/* Addresses */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <Addresses buyerId={buyer.id} initial={addresses || []} />
        </div>
      </section>

      {/* Compliance */}
      <section className="space-y-4 mt-8">
        <h2 className="text-lg font-semibold">Compliance</h2>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
          <Compliance buyerId={buyer.id} initial={compl} />
        </div>
      </section>
    </main>
  );
}
