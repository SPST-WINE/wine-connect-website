// app/admin/wines/new/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import {
  AdminToolbar,
  AdminCard,
  AdminSelect,
  AdminInput,
  AdminTextarea,
  AdminPrimaryButton,
} from "@/components/admin/UI";

export default async function NewWine() {
  const { ok } = await requireAdmin();
  if (!ok) {
    return (
      <main className="flex-1 px-5 grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center">
          Non autorizzato. <a className="underline" href="/login">Accedi</a>.
        </div>
      </main>
    );
  }

  const supa = createSupabaseServer();
  const { data: wineries } = await supa
    .from("wineries")
    .select("id,name")
    .eq("active", true)
    .order("name");

  return (
    <main className="flex-1 px-5">
      <div className="mx-auto max-w-[1000px] py-6 space-y-6">
        <AdminToolbar
          title="New wine"
          subtitle="Create the record, then you can upload the image on the detail page."
          right={
            <Link
              href="/admin/wines"
              className="rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5"
            >
              ← All wines
            </Link>
          }
        />

        <AdminCard className="p-5">
          <form action="/api/admin/wines/create" method="post" className="grid gap-4">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Winery *</span>
                <AdminSelect name="winery_id" required defaultValue="">
                  <option value="" disabled className="bg-[#0a1722]">
                    Select…
                  </option>
                  {(wineries ?? []).map((w) => (
                    <option key={w.id} value={w.id} className="bg-[#0a1722]">
                      {w.name}
                    </option>
                  ))}
                </AdminSelect>
              </label>

              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Name *</span>
                <AdminInput name="name" required placeholder="e.g. Sangiovese Demo" />
              </label>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Vintage</span>
                <AdminInput name="vintage" placeholder="2021" />
              </label>

              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Type</span>
                <AdminInput name="type" placeholder="Red / White / Rosé / Sparkling …" />
              </label>

              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Alcohol (% vol)</span>
                <AdminInput name="alcohol" type="number" step="0.1" placeholder="13.5" />
              </label>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Ex-cellar (€)</span>
                <AdminInput name="price_ex_cellar" type="number" step="0.01" />
              </label>
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Sample (€)</span>
                <AdminInput name="price_sample" type="number" step="0.01" />
              </label>
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">MOQ (bottles)</span>
                {/* BUGFIX: nome corretto 'moq' */}
                <AdminInput name="moq" type="number" />
              </label>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Grapes (CSV)</span>
                <AdminInput name="grape_varieties" placeholder="Sangiovese, Canaiolo" />
              </label>
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Certifications (CSV)</span>
                <AdminInput name="certifications" placeholder="BIO, DOCG" />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Description</span>
              <AdminTextarea name="description" rows={5} />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-white/85">
              <input type="checkbox" name="available" defaultChecked />
              Available in catalog
            </label>

            <div className="pt-2">
              <AdminPrimaryButton>Crea e continua</AdminPrimaryButton>
            </div>

            <p className="text-xs text-white/60">
              Dopo la creazione verrai reindirizzato alla pagina dettagli per completare o caricare
              l’immagine.
            </p>
          </form>
        </AdminCard>
      </div>
    </main>
  );
}

