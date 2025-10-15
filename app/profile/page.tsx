export const dynamic = "force-dynamic";

import Link from "next/link";
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
        </header>
        <main className="px-5">
          <div className="mx-auto max-w-5xl py-10 text-white/80">
            You’re not signed in.{" "}
            <a className="underline" href="/login">
              Sign in
            </a>
            .
          </div>
        </main>
      </div>
    );
  }

  const { data: buyer } = await supa
    .from("buyers")
    .select("id, company_name, contact_name, email, country, compliance_mode")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const buyerId = buyer?.id ?? null;

  const { data: addresses } = buyerId
    ? await supa
        .from("addresses")
        .select(
          "id,label,address,city,zip,country,is_default,full_name,line1,line2,region,postal_code,phone"
        )
        .eq("buyer_id", buyerId)
        .order("is_default", { ascending: false })
    : { data: [] as any[] };

  const { data: compl } = buyerId
    ? await supa
        .from("compliance_records")
        .select("id, mode, documents")
        .eq("buyer_id", buyerId)
        .maybeSingle()
    : { data: null as any };

  return (
    <div
      className="min-h-screen text-white"
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
        <div className="mx-auto max-w-5xl py-8">
          {/* Heading */}
          <div className="mb-4">
            <div className="text-xs uppercase tracking-wider text-white/60">
              Profile & compliance
            </div>
            <h1 className="text-3xl font-extrabold text-white">Your profile</h1>
            <p className="text-white/70 text-sm">
              {buyer?.email || user.email || "—"}
            </p>
          </div>

          {/* Profile (editable) */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <form action="/api/profile/update" method="post" className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="hidden" name="buyerId" value={buyerId ?? ""} />
              <Field label="Company">
                <input
                  name="company_name"
                  defaultValue={buyer?.company_name ?? ""}
                  placeholder="Company"
                  className="bg-black/30 outline-none w-full placeholder:text-white/40 rounded-lg border border-white/10 px-3 py-2"
                />
              </Field>
              <Field label="Contact name">
                <input
                  name="contact_name"
                  defaultValue={buyer?.contact_name ?? ""}
                  placeholder="Full name"
                  className="bg-black/30 outline-none w-full placeholder:text-white/40 rounded-lg border border-white/10 px-3 py-2"
                />
              </Field>
              <Field label="Email">
                <input
                  name="email"
                  defaultValue={buyer?.email ?? user.email ?? ""}
                  placeholder="name@company.com"
                  className="bg-black/30 outline-none w-full placeholder:text-white/40 rounded-lg border border-white/10 px-3 py-2"
                />
              </Field>
              <Field label="Country">
                <input
                  name="country"
                  defaultValue={buyer?.country ?? ""}
                  placeholder="Country"
                  className="bg-black/30 outline-none w-full placeholder:text-white/40 rounded-lg border border-white/10 px-3 py-2"
                />
              </Field>
              <div className="md:col-span-2">
                <button
                  className="mt-1 h-11 w-full md:w-auto rounded-xl px-5 font-semibold text-[#0f1720]"
                  style={{ background: "#E33955" }}
                >
                  Save profile
                </button>
              </div>
            </form>
          </section>

          {/* Addresses */}
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-white">Addresses</h2>
            <Addresses buyerId={buyerId!} initial={addresses || []} />
          </section>

          {/* Compliance */}
          <section className="mt-6">
            <h2 className="text-lg font-semibold text-white">Compliance</h2>
            <Compliance buyerId={buyerId!} initial={compl} />
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
      <span className="text-[11px] text-white/60">{label}</span>
      {children}
    </label>
  );
}
