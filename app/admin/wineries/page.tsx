export const dynamic = "force-dynamic";

import { requireAdmin } from "@/lib/is-admin";

export default async function AdminWineries() {
  const { ok, supa } = await requireAdmin();
  if (!ok || !supa) return <div className="mt-10">Non autorizzato.</div>;

  const { data: wineries, error } = await supa
    .from("wineries")
    .select("id, name, region, country, website, certifications, active, logo_url")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) return <div className="text-red-600">Errore: {error.message}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Cantine (Admin)</h1>

      {/* CREATE */}
      <section className="rounded border bg-white p-4">
        <h2 className="font-semibold mb-3">Aggiungi cantina</h2>
        <form action="/api/admin/wineries/create" method="post" className="grid gap-3 md:grid-cols-3">
          <input name="name" required placeholder="Nome cantina" className="border rounded p-2" />
          <input name="region" placeholder="Regione" className="border rounded p-2" />
          <input name="country" placeholder="Paese" className="border rounded p-2" />
          <input name="website" placeholder="Sito web (https://…)" className="border rounded p-2 md:col-span-2" />
          <input name="certifications" placeholder="Certificazioni (comma-separated)" className="border rounded p-2" />
          <div className="md:col-span-3 flex items-center gap-2">
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" name="active" defaultChecked />
              Attiva
            </label>
            <button className="ml-auto px-4 py-2 rounded bg-black text-white">Crea</button>
          </div>
        </form>
      </section>

      {/* LISTA */}
      <section className="grid gap-3">
        {(wineries ?? []).map((w: any) => (
          <article key={w.id} className="rounded border bg-white p-4">
            <div className="flex items-center gap-4">
              <img
                src={w.logo_url || "/placeholder.png"}
                alt=""
                className="h-16 w-16 rounded object-cover bg-neutral-100"
              />
              <div className="min-w-0">
                <div className="font-medium truncate">{w.name}</div>
                <div className="text-sm text-neutral-600 truncate">
                  {[w.region, w.country].filter(Boolean).join(" · ") || "—"}
                </div>
                <div className="text-xs mt-1">
                  {w.active ? "Attiva" : "Non attiva"}
                  {w.website ? ` • ${w.website}` : ""}
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {/* toggle active */}
              <form action="/api/admin/wineries/update" method="post" className="flex items-center gap-2">
                <input type="hidden" name="id" value={w.id} />
                <input type="hidden" name="active" value={w.active ? "false" : "true"} />
                <button className="px-3 py-1.5 rounded border">{w.active ? "Metti OFF" : "Metti ON"}</button>
              </form>

              {/* update rapidi */}
              <form action="/api/admin/wineries/update" method="post" className="flex items-center gap-2">
                <input type="hidden" name="id" value={w.id} />
                <input name="region" placeholder="Regione" defaultValue={w.region ?? ""} className="border rounded p-1.5 w-36 text-sm" />
                <input name="country" placeholder="Paese" defaultValue={w.country ?? ""} className="border rounded p-1.5 w-28 text-sm" />
                <input name="website" placeholder="Sito" defaultValue={w.website ?? ""} className="border rounded p-1.5 w-56 text-sm" />
                <button className="px-3 py-1.5 rounded border">Salva</button>
              </form>

              {/* upload logo */}
              <form
                action="/api/admin/wineries/upload-logo"
                method="post"
                encType="multipart/form-data"
                className="flex items-center gap-2"
              >
                <input type="hidden" name="wineryId" value={w.id} />
                <input type="file" name="file" accept="image/*" className="text-sm" required />
                <button className="px-3 py-1.5 rounded border">Carica logo</button>
              </form>

              {/* delete */}
              <form action="/api/admin/wineries/delete" method="post" className="ml-auto">
                <input type="hidden" name="id" value={w.id} />
                <button className="px-3 py-1.5 rounded border border-red-600 text-red-600">
                  Elimina
                </button>
              </form>
            </div>
          </article>
        ))}

        {(wineries ?? []).length === 0 && (
          <div className="rounded border bg-white p-4 text-sm">Nessuna cantina.</div>
        )}
      </section>
    </div>
  );
}
