export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function NewWineWizard({ searchParams }: { searchParams: any }) {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato. <Link className="underline" href="/login">Accedi</Link>.</div>;

  const step = Number(searchParams.step ?? 1);
  const wineId = searchParams.wineId ? String(searchParams.wineId) : null;

  const supa = createSupabaseServer();
  const { data: wineries } = await supa.from("wineries").select("id,name").order("name");

  // se abbiamo wineId, recupero lo stato corrente (preview/riepilogo)
  let wine: any = null;
  if (wineId) {
    const w = await supa.from("wines")
      .select("id, winery_id, name, vintage, type, grape_varieties, alcohol, price_ex_cellar, price_sample, moq, certifications, description, available, image_url")
      .eq("id", wineId).single();
    wine = w.data ?? null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Nuovo vino • Step {step}</h1>
        <Link className="underline" href="/admin/wines">Indietro ai vini</Link>
      </div>

      {step === 1 && (
        <section className="rounded border bg-white p-4 max-w-2xl">
          <h2 className="font-semibold mb-3">Step 1 · Base</h2>
          <form action="/api/admin/wines/wizard" method="post" className="grid gap-3">
            <input type="hidden" name="action" value="create-base"/>
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Cantina</span>
              <select name="winery_id" required className="border rounded p-2">
                <option value="">—</option>
                {(wineries ?? []).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </label>

            <div className="grid md:grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-xs text-neutral-600">Nome vino</span>
                <input name="name" required className="border rounded p-2"/>
              </label>
              <label className="grid gap-1">
                <span className="text-xs text-neutral-600">Annata</span>
                <input name="vintage" className="border rounded p-2" placeholder="es. 2021"/>
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Tipo (Red/White/Rosé/Sparkling)</span>
              <input name="type" className="border rounded p-2"/>
            </label>

            <button className="px-4 py-2 rounded bg-black text-white">Prosegui</button>
          </form>
        </section>
      )}

      {step === 2 && wineId && (
        <section className="rounded border bg-white p-4 max-w-2xl">
          <h2 className="font-semibold mb-3">Step 2 · Dati tecnici</h2>
          <form action="/api/admin/wines/wizard" method="post" className="grid gap-3">
            <input type="hidden" name="action" value="update-tech"/>
            <input type="hidden" name="wineId" value={wineId}/>
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Vitigni (separati da virgola)</span>
              <input name="grape_varieties" defaultValue={(wine?.grape_varieties ?? []).join(", ")} className="border rounded p-2"/>
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Alcol (%)</span>
              <input name="alcohol" type="number" step="0.1" defaultValue={wine?.alcohol ?? ""} className="border rounded p-2"/>
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Certificazioni (BIO, DOCG…)</span>
              <input name="certifications" defaultValue={(wine?.certifications ?? []).join(", ")} className="border rounded p-2"/>
            </label>
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Descrizione</span>
              <textarea name="description" defaultValue={wine?.description ?? ""} className="border rounded p-2 min-h-[100px]"/>
            </label>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded bg-black text-white">Prosegui</button>
              <Link className="px-4 py-2 rounded border" href={`/admin/wines/new?step=1&wineId=${wineId}`}>Indietro</Link>
            </div>
          </form>
        </section>
      )}

      {step === 3 && wineId && (
        <section className="rounded border bg-white p-4 max-w-2xl">
          <h2 className="font-semibold mb-3">Step 3 · Prezzi & Disponibilità</h2>
          <form action="/api/admin/wines/wizard" method="post" className="grid gap-3">
            <input type="hidden" name="action" value="update-pricing"/>
            <input type="hidden" name="wineId" value={wineId}/>
            <div className="grid md:grid-cols-3 gap-3">
              <label className="grid gap-1">
                <span className="text-xs text-neutral-600">Ex-cellar (€)</span>
                <input name="price_ex_cellar" type="number" step="0.01" defaultValue={wine?.price_ex_cellar ?? ""} className="border rounded p-2"/>
              </label>
              <label className="grid gap-1">
                <span className="text-xs text-neutral-600">Prezzo sample (€)</span>
                <input name="price_sample" type="number" step="0.01" defaultValue={wine?.price_sample ?? ""} className="border rounded p-2"/>
              </label>
              <label className="grid gap-1">
                <span className="text-xs text-neutral-600">MOQ</span>
                <input name="moq" type="number" step="1" defaultValue={wine?.moq ?? ""} className="border rounded p-2"/>
              </label>
            </div>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" name="available" defaultChecked={!!wine?.available}/>
              <span>Disponibile</span>
            </label>

            <div className="flex items-center gap-2">
              <button className="px-4 py-2 rounded bg-black text-white">Riepilogo</button>
              <Link className="px-4 py-2 rounded border" href={`/admin/wines/new?step=2&wineId=${wineId}`}>Indietro</Link>
            </div>
          </form>
        </section>
      )}

      {step === 4 && wineId && (
        <section className="rounded border bg-white p-4">
          <h2 className="font-semibold mb-3">Riepilogo</h2>
          <div className="text-sm text-neutral-700 mb-4">
            ID: {wineId}
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/admin/wines/${wineId}`} className="px-4 py-2 rounded bg-black text-white">Apri scheda vino</Link>
            <Link href={`/admin/wines`} className="px-4 py-2 rounded border">Torna all’elenco</Link>
          </div>
        </section>
      )}
    </div>
  );
}
