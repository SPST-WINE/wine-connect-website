export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import ConfirmSubmit from "@/components/ConfirmSubmit";

type Row = {
  id: string;
  name: string;
  vintage: string | null;
  type: string | null;
  available: boolean | null;
  image_url: string | null;
  wineries: { name: string } | null;
};

export default async function AdminWines() {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato.</div>;

  const supa = createSupabaseServer();
  const { data: wines } = await supa
    .from("wines")
    .select("id,name,vintage,type,available,image_url,wineries(name)")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Wines (immagini & dettagli)</h1>
          <nav className="mt-1 text-sm flex gap-4">
            <Link className="underline" href="/admin">Dashboard</Link>
            <Link className="underline" href="/admin/orders">Ordini</Link>
            <Link className="underline" href="/admin/wineries">Cantine</Link>
            <span className="text-neutral-400">Vini</span>
          </nav>
        </div>
        <Link
          href="/admin/wines/new"
          className="px-4 py-2 rounded bg-black text-white text-sm"
        >
          + Nuovo vino
        </Link>
      </div>

      {/* Lista vini */}
      <ul className="grid gap-4">
        {(wines ?? []).map((w) => (
          <li key={w.id} className="rounded border bg-white p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
              {/* thumb */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.image_url || "/placeholder.png"}
                alt=""
                className="h-14 w-14 rounded object-cover bg-neutral-100"
              />

              {/* info */}
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">
                  {w.name}{" "}
                  {w.vintage ? (
                    <span className="text-neutral-500">({w.vintage})</span>
                  ) : null}
                </div>
                <div className="text-sm text-neutral-600 truncate">
                  {w.wineries?.name ?? "—"} {w.type ? `· ${w.type}` : ""}
                </div>
                <div className="text-xs mt-0.5">
                  {w.available ? "Disponibile a catalogo" : "Non disponibile"}
                </div>
              </div>

              {/* azioni */}
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Edit dettagli */}
                <Link
                  className="px-3 py-1.5 rounded border text-sm"
                  href={`/admin/wines/${w.id}`}
                >
                  Modifica dettagli
                </Link>

                {/* Upload immagine */}
                <form
                  action="/api/admin/wines/upload-image"
                  method="post"
                  encType="multipart/form-data"
                  className="flex items-center gap-2"
                >
                  <input type="hidden" name="wineId" value={w.id} />
                  <input
                    className="text-sm"
                    type="file"
                    name="file"
                    accept="image/*"
                    required
                  />
                  <button className="px-3 py-1.5 rounded border text-sm">
                    Upload
                  </button>
                </form>

                {/* Elimina */}
                <form action="/api/admin/wines/delete" method="post">
                  <input type="hidden" name="id" value={w.id} />
                  <ConfirmSubmit
                    confirmMessage="Eliminare il vino?"
                    className="px-3 py-1.5 rounded border border-red-600 text-red-600 text-sm"
                  >
                    Elimina
                  </ConfirmSubmit>
                </form>
              </div>
            </div>

            {/* URL immagine (aiuta debugging) */}
            {w.image_url && (
              <div className="mt-2 text-xs text-neutral-500 truncate">
                {w.image_url}
              </div>
            )}
          </li>
        ))}

        {(wines ?? []).length === 0 && (
          <li className="rounded border bg-white p-6 text-sm text-center text-neutral-600">
            Nessun vino inserito. Usa “Nuovo vino” per crearne uno.
          </li>
        )}
      </ul>
    </div>
  );
}
