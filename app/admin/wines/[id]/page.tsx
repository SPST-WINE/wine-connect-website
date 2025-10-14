// app/admin/wines/[id]/page.tsx
export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { requireAdmin } from '@/lib/is-admin';
import { createSupabaseServer } from '@/lib/supabase/server';
import ConfirmSubmit from '@/components/ConfirmSubmit';

type Wine = {
  id: string;
  winery_id: string | null;
  name: string;
  vintage: string | null;
  type: string | null;
  grape_varieties: string[] | null;
  alcohol: number | null;
  price_ex_cellar: number | null;
  price_sample: number | null;
  moq: number | null;
  certifications: string[] | null;
  bottle_size_ml: number | null;
  description: string | null;
  image_url: string | null;
  available: boolean | null;
};

type WineryOpt = { id: string; name: string };

function arrToCsv(a?: string[] | null) {
  return (a ?? []).join(', ');
}

export default async function AdminWineDetail({
  params,
}: {
  params: { id: string };
}) {
  const { ok } = await requireAdmin();
  if (!ok) {
    return (
      <div className="mt-10">
        Non autorizzato. <Link className="underline" href="/login">Accedi</Link>.
      </div>
    );
  }

  const supa = createSupabaseServer();
  const [{ data: wine, error }, { data: wineries }] = await Promise.all([
    supa.from('wines').select('*').eq('id', params.id).single<Wine>(),
    supa.from('wineries').select('id,name').eq('active', true).order('name', { ascending: true }) as any as Promise<{ data: WineryOpt[] | null }>,
  ]);

  if (error || !wine) return notFound();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Modifica vino</h1>
          <div className="text-sm text-neutral-600 break-all">#{wine.id}</div>
        </div>
        <nav className="text-sm flex gap-4">
          <Link className="underline" href="/admin">Dashboard</Link>
          <Link className="underline" href="/admin/wines">Vini</Link>
          <Link className="underline" href="/admin/wineries">Cantine</Link>
        </nav>
      </div>

      {/* Info immagine */}
      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">Immagine</h2>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded border overflow-hidden bg-neutral-50 grid place-items-center">
            {/* 1:1 preview */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                wine.image_url ||
                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="10" fill="%239ca3af">no image</text></svg>'
              }
              alt="Wine image"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <div className="text-sm text-neutral-700 truncate max-w-[70ch]">
              {wine.image_url || '—'}
            </div>
            <div className="mt-2">
              <Link className="underline text-sm" href="/admin/wines">
                Carica/aggiorna immagine →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Form dettagli */}
      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-4">Dettagli</h2>

        <form action="/api/admin/wines/update" method="post" className="grid gap-4">
          <input type="hidden" name="id" value={wine.id} />

          {/* Riga 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Nome</span>
              <input
                name="name"
                defaultValue={wine.name ?? ''}
                className="border rounded p-2"
                required
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Annata (vintage)</span>
              <input
                name="vintage"
                defaultValue={wine.vintage ?? ''}
                className="border rounded p-2"
                placeholder="2021"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Tipo</span>
              <input
                name="type"
                defaultValue={wine.type ?? ''}
                className="border rounded p-2"
                placeholder="Red / White / Rosé / Sparkling ..."
              />
            </label>
          </div>

          {/* Riga 2 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Cantina</span>
              <select
                name="winery_id"
                defaultValue={wine.winery_id ?? ''}
                className="border rounded p-2"
                required
              >
                <option value="" disabled>
                  Seleziona cantina
                </option>
                {(wineries ?? []).map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Gradazione (% Vol)</span>
              <input
                name="alcohol"
                type="number"
                step="0.1"
                defaultValue={wine.alcohol ?? undefined}
                className="border rounded p-2"
                placeholder="13.5"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Formato (ml)</span>
              <input
                name="bottle_size_ml"
                type="number"
                defaultValue={wine.bottle_size_ml ?? undefined}
                className="border rounded p-2"
                placeholder="750"
              />
            </label>
          </div>

          {/* Riga 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Uve (CSV)</span>
              <input
                name="grape_varieties"
                defaultValue={arrToCsv(wine.grape_varieties)}
                className="border rounded p-2"
                placeholder="Sangiovese, Canaiolo"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Certificazioni (CSV)</span>
              <input
                name="certifications"
                defaultValue={arrToCsv(wine.certifications)}
                className="border rounded p-2"
                placeholder="BIO, DOCG"
              />
            </label>
          </div>

          {/* Riga 4 prezzi/MOQ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Prezzo ex-cellar (€)</span>
              <input
                name="price_ex_cellar"
                type="number"
                step="0.01"
                defaultValue={wine.price_ex_cellar ?? undefined}
                className="border rounded p-2"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Prezzo sample (€)</span>
              <input
                name="price_sample"
                type="number"
                step="0.01"
                defaultValue={wine.price_sample ?? undefined}
                className="border rounded p-2"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">MOQ (bottiglie)</span>
              <input
                name="moq"
                type="number"
                defaultValue={wine.moq ?? undefined}
                className="border rounded p-2"
              />
            </label>
          </div>

          {/* Descrizione + disponibile */}
          <div className="grid grid-cols-1 gap-3">
            <label className="grid gap-1">
              <span className="text-xs text-neutral-600">Descrizione</span>
              <textarea
                name="description"
                className="border rounded p-2 min-h-[100px]"
                defaultValue={wine.description ?? ''}
                placeholder="Note di degustazione, vinificazione, abbinamenti..."
              />
            </label>

            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="available"
                defaultChecked={!!wine.available}
              />
              Disponibile a catalogo
            </label>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2 rounded bg-black text-white">
              Salva modifiche
            </button>
            <Link
              href="/admin/wines"
              className="px-4 py-2 rounded border text-sm inline-flex items-center justify-center"
            >
              Indietro
            </Link>
          </div>
        </form>
      </section>

      {/* Danger zone */}
      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3 text-red-600">Danger zone</h2>
        <form action="/api/admin/wines/delete" method="post" className="max-w-sm">
          <input type="hidden" name="id" value={wine.id} />
          <ConfirmSubmit
            confirmMessage="Eliminare il vino?"
            className="w-full px-3 py-2 rounded border border-red-600 text-red-600"
          >
            Elimina vino
          </ConfirmSubmit>
        </form>
      </section>
    </div>
  );
}
