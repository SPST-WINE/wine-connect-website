export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";

type Params = { params: { id: string } };

export default async function AdminWineEdit({ params }: Params) {
  const { ok, supa } = await requireAdmin();
  if (!ok || !supa) return <div className="mt-10">Non autorizzato.</div>;

  const wineId = params.id;

  // wine + winery list (per dropdown)
  const [{ data: wine, error }, { data: wineries }] = await Promise.all([
    supa.from("wines").select("*").eq("id", wineId).maybeSingle(),
    supa.from("wineries").select("id,name").order("name"),
  ]);

  if (error) return <div className="text-red-600">Errore: {error.message}</div>;
  if (!wine) return <div className="text-sm">Vino non trovato.</div>;

  const arrToStr = (a: any[] | null) => (Array.isArray(a) ? a.join(", ") : "");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit vino · {wine.name}</h1>
        <Link className="underline" href="/admin/wines">← Tutti i vini</Link>
      </div>

      <section className="rounded border bg-white p-4 grid gap-6 md:grid-cols-[2fr_1fr]">
        {/* FORM PRINCIPALE */}
        <form action="/api/admin/wines/update" method="post" className="grid gap-3">
          <input type="hidden" name="id" value={wine.id} />
          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm">Nome</span>
              <input name="name" defaultValue={wine.name ?? ""} className="border rounded p-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Annata</span>
              <input name="vintage" defaultValue={wine.vintage ?? ""} className="border rounded p-2" />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Tipo</span>
              <input name="type" defaultValue={wine.type ?? ""} className="border rounded p-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Alcol %</span>
              <input name="alcohol" type="number" step="0.1" defaultValue={wine.alcohol ?? ""} className="border rounded p-2" />
            </label>

            <label className="grid gap-1">
              <span className="text-sm">Bottle size (ml)</span>
              <input name="bottle_size_ml" type="number" defaultValue={wine.bottle_size_ml ?? ""} className="border rounded p-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">MOQ</span>
              <input name="MOQ" type="number" defaultValue={wine.MOQ ?? ""} className="border rounded p-2" />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm">Ex-cellar (€)</span>
              <input name="price_ex_cellar" type="number" step="0.01" defaultValue={wine.price_ex_cellar ?? ""} className="border rounded p-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Sample (€)</span>
              <input name="price_sample" type="number" step="0.01" defaultValue={wine.price_sample ?? ""} className="border rounded p-2" />
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm">Uve (comma-separate)</span>
              <input name="grape_varieties" defaultValue={arrToStr(wine.grape_varieties)} className="border rounded p-2" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm">Certificazioni (comma-separate)</span>
              <input name="certifications" defaultValue={arrToStr(wine.certifications)} className="border rounded p-2" />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-sm">Cantina</span>
            <select name="winery_id" defaultValue={wine.winery_id ?? ""} className="border rounded p-2">
              <option value="">—</option>
              {(wineries ?? []).map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Descrizione</span>
            <textarea name="description" rows={6} defaultValue={wine.description ?? ""} className="border rounded p-2" />
          </label>

          <div className="flex items-center gap-3">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="available" defaultChecked={!!wine.available} />
              Disponibile
            </label>
            <button className="ml-auto px-4 py-2 rounded bg-black text-white">Salva</button>
          </div>
        </form>

        {/* LATO DESTRO: immagine + azioni veloci */}
        <div className="space-y-4">
          <div className="rounded border p-3">
            <img
              src={wine.image_url || "/placeholder.png"}
              alt=""
              className="w-full aspect-square object-cover bg-neutral-100 rounded"
            />
            <form
              action="/api/admin/wines/upload-image"
              method="post"
              encType="multipart/form-data"
              className="mt-3 flex items-center gap-2"
            >
              <input type="hidden" name="wineId" value={wine.id} />
              <input type="file" name="file" accept="image/*" required className="text-sm" />
              <button className="px-3 py-1.5 rounded border">Carica immagine</button>
            </form>
          </div>

          <form action="/api/admin/wines/delete" method="post" className="rounded border p-3">
            <input type="hidden" name="id" value={wine.id} />
            <button
              className="w-full px-3 py-2 rounded border border-red-600 text-red-600"
              onClick={(e) => { if (!confirm("Eliminare il vino?")) e.preventDefault(); }}
            >
              Elimina vino
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
