import { requireAdmin } from "@/lib/is-admin";

export default async function AdminWines() {
  const { ok, supa } = await requireAdmin();
  if (!ok || !supa) return <div className="mt-10">Non autorizzato.</div>;

  const { data: wines } = await supa
    .from("wines")
    .select("id, name, vintage, image_url")
    .order("name");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Wines (immagini)</h1>
      <ul className="grid gap-3">
        {(wines||[]).map((w:any)=>(
          <li key={w.id} className="rounded border bg-white p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {w.image_url ? (
                <img src={w.image_url} alt={w.name} className="h-12 w-12 object-cover rounded border" />
              ) : (
                <div className="h-12 w-12 grid place-items-center text-xs text-neutral-500 border rounded">
                  no img
                </div>
              )}
              <div>
                <div className="font-medium">{w.name}{w.vintage?` (${w.vintage})`:""}</div>
                <div className="text-xs text-neutral-600 break-all">{w.image_url || "—"}</div>
              </div>
            </div>

            <form action="/api/admin/wines/upload-image" method="post" encType="multipart/form-data" className="flex items-center gap-2">
              <input type="hidden" name="wineId" value={w.id}/>
              <input type="file" name="file" accept="image/*" required className="text-sm"/>
              <button className="px-3 py-1.5 rounded bg-black text-white text-sm">Upload</button>
            </form>
          </li>
        ))}
        {(wines||[]).length===0 && <li className="rounded border bg-white p-4 text-sm">Nessun vino.</li>}
      </ul>
    </div>
  );
}
