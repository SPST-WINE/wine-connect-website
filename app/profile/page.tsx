export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

/** Load buyer and their addresses */
async function getProfile() {
  const supa = createSupabaseServer();

  const { data: { user } } = await supa.auth.getUser();
  if (!user) return { user: null, buyer: null, addresses: [] as any[] };

  const { data: buyer } = await supa
    .from("buyers")
    .select("id, email, company_name, name, country")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  let addresses: any[] = [];
  if (buyer) {
    const { data } = await supa
      .from("addresses")
      .select("id, label, full_name, line1, line2, city, region, postal_code, country, phone")
      .eq("buyer_id", buyer.id)
      .order("created_at", { ascending: false });
    addresses = data || [];
  }

  return { user, buyer, addresses };
}

export default async function ProfilePage() {
  const { buyer, addresses } = await getProfile();

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
        <div className="mx-auto max-w-5xl py-6">
          {/* Heading */}
          <div className="text-xs uppercase tracking-wider text-white/60">
            Profile & compliance
          </div>
          <h1 className="text-3xl font-extrabold text-white">Your profile</h1>

          {/* Buyer summary */}
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <SummaryItem label="Company">{buyer?.company_name || "—"}</SummaryItem>
              <SummaryItem label="Contact name">{buyer?.name || "—"}</SummaryItem>
              <SummaryItem label="Email">{buyer?.email || "—"}</SummaryItem>
              <SummaryItem label="Country">{buyer?.country || "—"}</SummaryItem>
            </div>
          </div>

          {/* Addresses */}
          <section className="mt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Addresses</h2>
            </div>

            <div className="mt-3 grid gap-3">
              {addresses.map((a) => (
                <div key={a.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="text-white">
                      <div className="font-semibold">{a.label || "Address"}</div>
                      <div className="text-white/80 text-sm">
                        {a.full_name || "—"}
                        <br />
                        {a.line1} {a.line2}
                        <br />
                        {a.city} {a.region} {a.postal_code}
                        <br />
                        {a.country}
                        {a.phone ? <><br />{a.phone}</> : null}
                      </div>
                    </div>

                    {/* Delete */}
                    <form action="/api/profile/address/delete" method="post" className="shrink-0">
                      <input type="hidden" name="addressId" value={a.id} />
                      <button className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/90 hover:bg-white/5">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}

              {addresses.length === 0 && (
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center text-white/70">
                  No addresses yet.
                </div>
              )}
            </div>

            {/* New address */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="text-white font-semibold mb-3">Add a new address</h3>
              <form action="/api/profile/address/create" method="post" className="grid gap-3 sm:grid-cols-2">
                <Input label="Label (e.g., Warehouse)" name="label" />
                <Input label="Full name" name="full_name" />
                <Input label="Address line 1" name="line1" />
                <Input label="Address line 2" name="line2" />
                <Input label="City" name="city" />
                <Input label="Region / State" name="region" />
                <Input label="Postal code" name="postal_code" />
                <Input label="Country" name="country" />
                <Input label="Phone" name="phone" />

                <div className="sm:col-span-2 text-right">
                  <button
                    className="rounded-xl px-4 py-2 text-sm font-semibold text-[#0f1720]"
                    style={{ background: "#E33955" }}
                  >
                    Save address
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}

/* ---------- tiny UI helpers (server-safe) ---------- */
function SummaryItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] text-white/60">{label}</div>
      <div className="text-white font-medium">{children}</div>
    </div>
  );
}

function Input({
  label,
  name,
  type = "text",
}: {
  label: string;
  name: string;
  type?: string;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-[11px] text-white/60">{label}</span>
      <input
        name={name}
        type={type}
        className="rounded-xl bg-black/30 border border-white/10 px-3 py-3 text-white placeholder:text-white/40"
      />
    </label>
  );
}
