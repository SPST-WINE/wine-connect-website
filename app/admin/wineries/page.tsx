export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function AdminWineries() {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato. <Link className="underline" href="/login">Accedi</Link>.</div>;

  const supa = createSupabaseServer();
  const { data: rows } = await supa
    .from("wineries")
    .select("id, name, region, country")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cantine</h1>
        <Link href="/admin/wineries/new" className="px-3 py-2 rounded bg-black text-white text-sm">Nuova cantina</Link>
      </div>

      <ul className="grid gap-3">
        {(rows ?? []).map(w => (
          <li key={w.id} className="rounded border bg-white p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{w.name}</div>
              <div className="text-sm text-neutral-600">{w.region} · {w.country}</div>
            </div>
            <div className="flex items-center gap-2">
              <Link href={`/admin/wineries/${w.id}`} className="px-3 py-2 rounded border text-sm">Modifica</Link>
              <form action="/api/admin/wineries/delete" method="post">
                <input type="hidden" name="id" value={w.id}/>
                <button className="px-3 py-2 rounded border border-red-600 text-red-600 text-sm">Elimina</button>
              </form>
            </div>
          </li>
        ))}
        {(rows ?? []).length === 0 && <li className="rounded border bg-white p-4 text-sm">Nessuna cantina.</li>}
      </ul>
    </div>
  );
}
