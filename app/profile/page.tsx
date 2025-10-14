import { createSupabaseServer } from "@/lib/supabase/server";
import Addresses from "@/components/profile/Addresses";
import Compliance from "@/components/profile/Compliance";

export default async function ProfilePage() {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    return (
      <div className="mt-10">
        Devi <a className="underline" href="/login">accedere</a>.
      </div>
    );
  }

  const { data: buyer } = await supa
    .from("buyers")
    .select("id, company_name, contact_name, email, country, compliance_mode")
    .eq("auth_user_id", user.id)
    .single();

  if (!buyer) return <div>Profilo buyer non trovato.</div>;

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
    <div className="max-w-3xl mx-auto space-y-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-neutral-600">
          {buyer.company_name} — {buyer.email}
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Addresses</h2>
        <Addresses buyerId={buyer.id} initial={addresses || []} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Compliance</h2>
        <Compliance buyerId={buyer.id} initial={compl} />
      </section>
    </div>
  );
}
