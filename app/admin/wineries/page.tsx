export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import ConfirmSubmit from "@/components/ConfirmSubmit";

type Winery = {
  id: string;
  name: string;
  region: string | null;
  country: string | null;
  website: string | null;
  active: boolean | null;
  logo_url: string | null;
};

export default async function AdminWineries() {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato.</div>;

  const supa = createSupabaseServer();
  const { data: wineries } = await supa
    .from("wineries")
    .select("id,name,region,country,website,active,logo_url")
    .order("name", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cantine</h1>
        <div className="flex items-center gap-3 text-sm">
          <Link className="underline" href="/admin">Dashboard</Link>
          <Link className="px-3 py-2 rounded bg-black text-white" href="/admin/wineries/new">
            + Nuova cantina
          </Link>
        </div>
      </div>

      <ul className="grid gap-3">
        {(wineries ?? []).map((w) => (
          <li key={w.id} className="rounded border bg-white p-4">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.logo_url || "/placeholder.png"}
                alt=""
                className="h-12 w-12 rounded object-cover bg-neutral-100"
              />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{w.name}</div>
                <div className="text-sm text-neutral-600 truncate">
                  {[w.region, w.country].filter(Boolean).join(" · ") || "—"}{" "}
                  {w.website ? " · " : ""}
                  {w.website ? <a className="underline" href={w.website} target="_blank">sito</a> : null}
                </div>
                <div className="text-xs mt-1">{w.active ? "Attiva" : "Disattivata"}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link className="px-3 py-1.5 rounded border text-sm" href={`/admin/wineries/${w.id}`}>
                  Modifica
                </Link>
                <form action="/api/admin/wineries/delete" method="post">
                  <input type="hidden" name="id" value={w.id} />
                  <ConfirmSubmit
                    confirmMessage="Eliminare la cantina?"
                    className="px-3 py-1.5 rounded border border-red-600 text-red-600 text-sm"
                  >
                    Elimina
                  </ConfirmSubmit>
                </form>
              </div>
            </div>
          </li>
        ))}
        {(wineries ?? []).length === 0 && (
          <li className="rounded border bg-white p-4 text-sm">Nessuna cantina presente.</li>
        )}
      </ul>
    </div>
  );
}
