export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import Addresses from "@/components/profile/Addresses";
import Compliance from "@/components/profile/Compliance";

type SearchParams = { err?: string; ok?: string };

export default async function ProfilePage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const supa = createSupabaseServer();

  /* ---------- Auth ---------- */
  const {
    data: { user },
  } = await supa.auth.getUser();

  const gradient = {
    background:
      "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)",
  };

  if (!user) {
    return (
      <main className="min-h-screen" style={gradient}>
        <header className="h-14 flex items-center justify-between px-5">
          <div className="flex items-center gap-2 text-white">
            <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
            <span className="font-semibold">Wine Connect</span>
          </div>
        </header>

        <div className="mx-auto max-w-5xl px-5 py-10">
          <h1 className="text-2xl font-semibold text-white">Your profile</h1>
          <p className="mt-2 text-sm text-white/70">
            You are not signed in. <a className="underline" href="/login">Sign in</a>.
          </p>
        </div>
      </main>
    );
  }

  /* ---------- Buyer ---------- */
  const { data: buyer } = await supa
    .from("buyers")
    .select("id, company_name, contact_name, email, country, auth_user_id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!buyer) {
    return (
      <main className="min-h-screen" style={gradient}>
        <header className="h-14 flex items-center justify-between px-5">
          <a href="/buyer-home" className="flex items-center gap-2 text-white">
            <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
            <span className="font-semibold">Wine Connect</span>
          </a>
        </header>
        <div className="mx-auto max-w-5xl px-5 py-10 text-white">
          Buyer profile not found.
        </div>
      </main>
    );
  }

  /* ---------- Compliance record (può non esistere) ---------- */
  const { data: complRaw } = await supa
    .from("compliance_records")
    .select("id, buyer_id, mode, documents")
    .eq("buyer_id", buyer.id)
    .maybeSingle();

  // Normalizzazione: documents sempre OBJECT, non array
  const complianceSafe = {
    id: complRaw?.id ?? null,
    buyer_id: buyer.id,
    mode: (complRaw?.mode as "self" | "delegate") ?? "self",
    documents: (complRaw?.documents ?? {}) as Record<string, any>,
  };

  /* ---------- Indirizzi attivi ---------- */
  const { data: addressesRaw } = await supa
    .from("addresses")
    .select("id,label,address,city,zip,country,is_default")
    .eq("buyer_id", buyer.id)
    .eq("is_active", true)
    .order("is_default", { ascending: false });

  const addressesList = Array.isArray(addressesRaw) ? addressesRaw : [];

  /* ---------- Ordini per badge “in use” (opzionale) ---------- */
  const { data: ordersUsing } = await supa
    .from("orders")
    .select("shipping_address_id")
    .eq("buyer_id", buyer.id);

  const usageMap = new Map<string, number>();
  (ordersUsing || []).forEach((r: any) => {
    const id = r.shipping_address_id;
    if (!id) return;
    usageMap.set(id, (usageMap.get(id) ?? 0) + 1);
  });

  /* ---------- Banner messaggi ---------- */
  const err = searchParams?.err;
  const ok = searchParams?.ok;

  const errorBanner =
    err === "forbidden"
      ? "You are not allowed to perform this action."
      : err === "not_found"
      ? "Record not found."
      : err === "bad_type"
      ? "Unsupported file type. Please upload PDF, PNG or JPG."
      : err === "file_too_large"
      ? "File too large. Max 10 MB."
      : err === "upload_failed"
      ? "Upload failed. Please try again."
      : err === "save_failed"
      ? "Could not save the compliance record."
      : err === "address_in_use"
      ? "This address is used by one or more orders. It was hidden from your profile but kept as backup."
      : null;

  const okBanner =
    ok === "address_created"
      ? "Address saved."
      : ok === "address_deleted"
      ? "Address deleted."
      : ok === "profile_updated"
      ? "Profile updated."
      : ok === "document_uploaded" || ok === "compliance_file_uploaded"
      ? "Document uploaded."
      : ok === "compliance_file_removed"
      ? "Document removed."
      : ok === "compliance_mode_saved"
      ? "Compliance mode saved."
      : null;

  /* ---------- UI ---------- */
  return (
    <main className="min-h-screen" style={gradient}>
      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-5">
        <a href="/buyer-home" className="flex items-center gap-2 text-white">
          <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
          <span className="font-semibold">Wine Connect</span>
        </a>
        <nav className="flex items-center gap-5 text-sm">
          <Link className="text-white/80 hover:text-white" href="/catalog">
            Catalog
          </Link>
          <Link className="text-white/80 hover:text-white" href="/cart/samples">
            Sample Cart
          </Link>
        </nav>
      </header>

      <div className="mx-auto max-w-5xl px-5 py-8">
        {errorBanner && (
          <div className="mb-4 rounded-xl border border-white/10 bg-red-500/10 text-red-200 px-4 py-3 text-sm">
            {errorBanner}
          </div>
        )}
        {okBanner && (
          <div className="mb-4 rounded-xl border border-white/10 bg-emerald-500/10 text-emerald-200 px-4 py-3 text-sm">
            {okBanner}
          </div>
        )}

        <div className="text-xs uppercase tracking-wider text-white/60">
          Profile & compliance
        </div>
        <h1 className="text-3xl font-extrabold text-white">Your profile</h1>
        <p className="text-white/70 text-sm">— {buyer.email}</p>

        {/* Identity editable */}
        <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <form
            action="/api/profile/update"
            method="post"
            className="grid grid-cols-1 md:grid-cols-2 gap-3"
          >
            <input type="hidden" name="buyerId" value={buyer.id} />

            <FormField label="Company">
              <input
                name="company_name"
                defaultValue={buyer.company_name ?? ""}
                placeholder="Company"
                className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40"
              />
            </FormField>

            <FormField label="Contact name">
              <input
                name="contact_name"
                defaultValue={buyer.contact_name ?? ""}
                placeholder="Contact name"
                className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40"
              />
            </FormField>

            <FormField label="Email">
              <input
                disabled
                defaultValue={buyer.email ?? ""}
                className="w-full rounded-xl bg-black/20 border border-white/10 px-3 py-3 text-white/80"
              />
            </FormField>

            <FormField label="Country">
              <input
                name="country"
                defaultValue={buyer.country ?? ""}
                placeholder="Country"
                className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-3 outline-none text-white placeholder:text-white/40"
              />
            </FormField>

            <div className="md:col-span-2">
              <button
                className="h-11 rounded-xl px-4 text-sm font-semibold text-[#0f1720]"
                style={{ background: "#E33955" }}
              >
                Save profile
              </button>
            </div>
          </form>
        </section>

        {/* Addresses */}
        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-white">Addresses</h2>
          <Addresses
            buyerId={buyer.id}
            initial={addressesList}
            usage={Object.fromEntries(usageMap)}
          />
        </section>

        {/* Compliance */}
        <section className="mt-8 space-y-3">
          <h2 className="text-lg font-semibold text-white">Compliance</h2>
          <Compliance buyerId={buyer.id} initial={complianceSafe as any} />
        </section>
      </div>

      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </main>
  );
}

function FormField({
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
