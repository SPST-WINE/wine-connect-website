export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function NewWine() {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato.</div>;

  const supa = createSupabaseServer();
  const { data: wineries } = await supa.from("wineries").select("id,name").eq("active", true).order("name");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nuovo vino (wizard)</h1>
        <Link className="underline" href="/admin/wines">← Tutti i vini</Link>
      </div>

      <form action="/api/admin/wines/create" method="post" className="rounded border bg-white p-4 grid gap-4 max-w-3xl">
        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Cantina *</span>
            <select name="winery_id" required className="border rounded p-2">
              <option value="">Seleziona…</option>
              {(wineries ?? []).map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Nome *</span>
            <input name="name" required className="border rounded p-2" />
          </label>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Annata</span>
            <input name="vintage" className="border rounded p-2" placeholder="2021" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Tipo</span>
            <input name="type" className="border rounded p-2" placeholder="Red / White / Rosé / Sparkling ..." />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Gradazione (% Vol)</span>
            <input name="alcohol" type="number" step="0.1" className="border rounded p-2" placeholder="13.5" />
          </label>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Ex-cellar (€)</span>
            <input name="price_ex_cellar" type="number" step="0.01" className="border rounded p-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Sample (€)</span>
            <input name="price_sample" type="number" step="0.01" className="border rounded p-2" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">MOQ</span>
            <input name="MOQ" type="number" className="border rounded p-2" />
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Uve (CSV)</span>
            <input name="grape_varieties" className="border rounded p-2" placeholder="Sangiovese, Canaiolo" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Certificazioni (CSV)</span>
            <input name="certifications" className="border rounded p-2" placeholder="BIO, DOCG" />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm">Descrizione</span>
          <textarea name="description" rows={5} className="border rounded p-2" />
        </label>

        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="available" defaultChecked />
          Disponibile a catalogo
        </label>

        <div className="pt-2">
          <button className="px-4 py-2 rounded bg-black text-white">Crea e continua</button>
        </div>

        <p className="text-xs text-neutral-500">
          Dopo la creazione verrai reindirizzato alla pagina dettagli del vino per completare o caricare l’immagine.
        </p>
      </form>
    </div>
  );
}
