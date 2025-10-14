export const dynamic = "force-dynamic";

import { createSupabaseServer } from "@/lib/supabase/server";
import Addresses from "@/components/profile/Addresses";
import Compliance from "@/components/profile/Compliance";
import Link from "next/link";

export default async function ProfilePage() {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)",
        }}
      >
        <header className="h-14 flex items-center justify-between px-5">
          <Link href="/buyer-home" className="flex items-center gap-2 text-white">
            <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
            <span className="font-semibold">Wine Connect</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link className="text-white/80 hover:text-white" href="/catalog">
              Catalog
            </Link>
            <Link className="text-white/80 hover:text-white" href="/cart/samples">
              Sample Cart
            </Link>
          </nav>
        </header>

        <main className="px-5">
          <div className="mx-auto max-w-6xl py-10">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white/80">
              You must <a className="underline" href="/login">sign in</a>.
            </div>
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
    .select("id, company_name, contact_name, email, country, compliance_mode")
    .eq("auth_user_id", user.id)
    .single();

  if (!buyer) {
    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)",
        }}
      >
        <header className="h-14 flex items-center justify-between px-5">
          <Link href="/buyer-home" className="flex items-center gap-2 text-white">
            <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
            <span className="font-semibold">Wine Connect</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link className="text-white/80 hover:text-white" href="/catalog">
              Catalog
            </Link>
            <Link className="text-white/80 hover:text-white" href="/cart/samples">
              Sample Cart
            </Link>
          </nav>
        </header>

        <main className="px-5">
          <div className="mx-auto max-w-6xl py-10">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white/80">
              Buyer profile not found.
            </div>
          </div>
        </main>

        <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
          © {new Date().getFullYear()} Wine Connect — SPST
        </footer>
      </div>
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
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)",
      }}
    >
      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-5">
        <Link href="/buyer-home" className="flex items-center gap-2 text-white">
          <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
          <span className="font-semibold">Wine Connect</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link className="text-white/80 hover:text-white" href="/catalog">
            Catalog
          </Link>
          <Link className="text-white/80 hover:text-white" href="/cart/samples">
            Sample Cart
          </Link>
        </nav>
      </header>

      <main className="px-5">
        <div className="mx-auto max-w-6xl py-6">
          {/* Heading */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/60">
                Profile & compliance
              </div>
              <h1 className="text-3xl font-extrabold text-white">Your profile</h1>
              <p className="text-white/70 text-sm">
                {buyer.company_name} — {buyer.email}
              </p>
            </div>
          </div>

          {/* Identity card */}
          <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white">
              <Field label="Company">{buyer.company_name || "—"}</Field>
              <Field label="Contact name">{buyer.contact_name || "—"}</Field>
              <Field label="Email">{buyer.email || "—"}</Field>
              <Field label="Country">{buyer.country || "—"}</Field>
            </div>
          </section>

          {/* Addresses */}
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-white">Addresses</h2>
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Addresses buyerId={buyer.id} initial={addresses || []} />
            </div>
          </section>

          {/* Compliance */}
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-white">Compliance</h2>
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <Compliance buyerId={buyer.id} initial={compl} />
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1">
      <div className="text-[11px] text-white/60">{label}</div>
      <div className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white">
        {children}
      </div>
    </label>
  );
}
