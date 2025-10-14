export const dynamic = "force-dynamic";

import { createSupabaseServer } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supa = createSupabaseServer();

  const { data: { user } } = await supa.auth.getUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-10">
        <h1 className="text-2xl font-semibold">Your profile</h1>
        <p className="mt-2 text-sm text-neutral-500">
          You are not signed in. <a className="underline" href="/login">Sign in</a>.
        </p>
      </main>
    );
  }

  const { data: buyer } = await supa
    .from("buyers")
    .select("id, company_name, country, name, email")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const buyerId = buyer?.id ?? null;

  const { data: addresses } = buyerId
    ? await supa
        .from("addresses")
        .select("id,label,full_name,line1,line2,city,region,postal_code,country,phone")
        .eq("buyer_id", buyerId)
        .order("created_at", { ascending: true })
    : { data: [] as any[] };

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-10">
      <div className="text-xs uppercase tracking-wide text-neutral-400">Profile & compliance</div>
      <h1 className="text-2xl font-semibold">Your profile</h1>

      {/* Identity */}
      <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <Field label="Company">{buyer?.company_name ?? "—"}</Field>
          <Field label="Contact name">{buyer?.name ?? "—"}</Field>
          <Field label="Email">{buyer?.email ?? user.email ?? "—"}</Field>
          <Field label="Country">{buyer?.country ?? "—"}</Field>
        </div>
      </section>

      {/* Addresses list */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Addresses</h2>
        {(!addresses || addresses.length === 0) && (
          <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-neutral-500">
            No addresses yet.
          </div>
        )}
        {addresses && addresses.length > 0 && (
          <ul className="mt-3 space-y-3">
            {addresses.map((a) => (
              <li key={a.id} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm text-neutral-400 uppercase tracking-wide">{a.label || "Address"}</div>
                    <div className="font-medium">{a.full_name}</div>
                    <div className="text-sm text-neutral-500">
                      {a.line1}{a.line2 ? `, ${a.line2}` : ""} · {a.city}
                      {a.region ? `, ${a.region}` : ""} · {a.postal_code} · {a.country}
                    </div>
                    {a.phone ? <div className="text-sm text-neutral-500 mt-0.5">{a.phone}</div> : null}
                  </div>
                  <form action="/api/profile/address/delete" method="post">
                    <input type="hidden" name="addressId" value={a.id} />
                    <button className="rounded border px-3 py-2 text-sm hover:bg-white/5">
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Create address */}
      <section className="mt-6">
        <h2 className="text-lg font-semibold">Add a new address</h2>
        <form
          action="/api/profile/address/create"
          method="post"
          className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
        >
          <input type="hidden" name="buyerId" value={buyerId ?? ""} />

          <Input name="label" placeholder="Label (e.g., Warehouse)" />
          <Input name="full_name" placeholder="Full name" />
          <Input name="line1" placeholder="Address line 1" />
          <Input name="line2" placeholder="Address line 2" />
          <Input name="city" placeholder="City" />
          <Input name="region" placeholder="Region / State" />
          <Input name="postal_code" placeholder="Postal code" />
          <Input name="country" placeholder="Country" />
          <Input name="phone" placeholder="Phone" />

          <div className="md:col-span-2">
            <button className="h-11 w-full rounded-xl bg-[color:#E33955] font-semibold text-black hover:-translate-y-[1px] transition">
              Save address
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <div className="text-[11px] uppercase tracking-wide text-neutral-400">{label}</div>
      <div className="rounded-lg border border-white/10 bg-black/20 px-3 py-2">{children}</div>
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full rounded-lg border border-white/10 bg-transparent px-3 py-2 outline-none placeholder:text-neutral-500"
    />
  );
}
