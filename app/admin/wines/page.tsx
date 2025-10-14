export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";

export default async function AdminWines() {
  const { ok, supa } = await requireAdmin();
  if (!ok || !supa) return <div className="mt-10">Non autorizzato.</div>;

  // opzionale: carico tutte le cantine per eventuali filtri futuri
  const { data: wines } = await supa
    .from("wines")
    .select("id,name,vintage,image_url,winery_id")
    .order("name");

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Wines (immagini & dettagli)</h1>
        <div className="flex items-center gap-3 text-sm">
          <Link className="underline" href="/admin">Dashboard</Link>
          <Link className="underline" href="/admin/orders">Ordini</Link>
          <Link className="underline" href="/admin/wineries">Cantine</Link>
        </div>
      </div>

      {/* elenco */}
      <ul className="grid gap-3">
        {(wines ?? []).map((w) => (
          <li key={w.id} className="rounded border bg-white p-4">
            <div className="flex items-center gap-4">
              <img
                src={w.image_url || "/placeholder.png"}
                alt=""
                className="h-16 w-16 rounded object-cover bg-neutral-100"
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">
                  {w.name} {w.vintage ? <span className="text-neutral-500">({w.vintage})</span> : null}
                </div>

                {/* form upload immagine inline */}
                <form
                  action="/api/admin/wines/upload-image"
                  method="post"
                  encType="multipart/form-data"
                  className="mt-2 flex items-center gap-2"
                >
                  <input type="hidden" name="wineId" value={w.id} />
                  <input type="file" name="file" accept="image/*" required className="text-sm" />
                  <button className="px-3 py-1.5 rounded border text-sm">Upload</button>
                  {w.image_url && (
                    <a
                      href={w.image_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs underline text-neutral-600 truncate"
                    >
                      {w.image_url}
                    </a>
                  )}
                </form>
              </div>

              {/* azioni */}
              <div className="flex flex-col items-end gap-2">
                <Link
                  href={`/admin/wines/${w.id}`}
                  className="px-3 py-1.5 rounded bg-black text-white text-sm"
                >
                  Modifica dettagli
                </Link>
              </div>
            </div>
          </li>
        ))}

        {(wines ?? []).length === 0 && (
          <li className="rounded border bg-white p-4 text-sm">Nessun vino presente.</li>
        )}
      </ul>
    </div>
  );
}
