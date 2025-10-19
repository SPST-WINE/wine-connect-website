export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import ConfirmSubmit from "@/components/ConfirmSubmit";
import {
  AdminCard,
  AdminToolbar,
  AdminPrimaryButton,
  AdminGhostButton,
  AdminBadge,
  AdminFileInput,
} from "@/components/admin/UI";

type WineryObj = { name: string };
type Row = {
  id: string;
  name: string;
  vintage: string | null;
  type: string | null;
  available: boolean | null;
  image_url: string | null;
  wineries: WineryObj | WineryObj[] | null;
};

function getWineryName(w: Row): string {
  const v = w.wineries;
  if (!v) return "—";
  return Array.isArray(v) ? (v[0]?.name ?? "—") : (v.name ?? "—");
}

export default async function AdminWines() {
  const { ok } = await requireAdmin();
  if (!ok)
    return (
      <main className="flex-1 px-5 grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center">Non autorizzato.</div>
      </main>
    );

  const supa = createSupabaseServer();
  const { data: wines } = await supa
    .from("wines")
    .select("id,name,vintage,type,available,image_url,wineries(name)")
    .order("name", { ascending: true });

  const list = (wines as Row[] | null) ?? [];

  return (
    <main className="flex-1 px-5">
      <div className="mx-auto max-w-[1200px] py-6 space-y-6">
        <AdminToolbar
          title="Wines"
          subtitle="Images, availability and quick actions."
          right={
            <>
              <Link href="/admin" className="rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5">
                Dashboard
              </Link>
              <Link
                href="/admin/wines/new"
                className="rounded-xl px-3 py-2 font-semibold text-[#0f1720]"
                style={{ background: "#E33955" }}
              >
                + New wine
              </Link>
            </>
          }
        />

        <section className="grid gap-3">
          {list.map((w) => (
            <AdminCard key={w.id} className="p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
                {/* thumb */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.image_url || "/placeholder.png"}
                  alt=""
                  className="h-14 w-14 rounded-lg object-cover bg-black/30 border border-white/10"
                />

                {/* info */}
                <div className="min-w-0 flex-1">
                  <div className="font-semibold truncate text-white">
                    {w.name} {w.vintage ? <span className="text-white/60">({w.vintage})</span> : null}
                  </div>
                  <div className="text-sm text-white/70 truncate">
                    {getWineryName(w)} {w.type ? `· ${w.type}` : ""}
                  </div>
                  <div className="mt-1">
                    <AdminBadge tone={w.available ? "success" : "neutral"}>
                      {w.available ? "Available" : "Not available"}
                    </AdminBadge>
                  </div>
                </div>

                {/* actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/90 hover:bg-white/5"
                    href={`/admin/wines/${w.id}`}
                  >
                    Edit details
                  </Link>

                  <form
                    action="/api/admin/wines/upload-image"
                    method="post"
                    encType="multipart/form-data"
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="wineId" value={w.id} />
                    <AdminFileInput name="file" accept="image/*" required />
                    <AdminGhostButton className="text-sm">Upload</AdminGhostButton>
                  </form>

                  <form action="/api/admin/wines/delete" method="post">
                    <input type="hidden" name="id" value={w.id} />
                    <ConfirmSubmit
                      confirmMessage="Eliminare il vino?"
                      className="px-3 py-1.5 rounded-lg border border-red-500/50 text-red-200 text-sm hover:bg-red-500/10"
                    >
                      Elimina
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>

              {w.image_url && (
                <div className="mt-2 text-xs text-white/60 truncate">{w.image_url}</div>
              )}
            </AdminCard>
          ))}

          {list.length === 0 && (
            <AdminCard className="p-6 text-sm text-white/80 text-center">
              Nessun vino inserito. Usa “New wine” per crearne uno.
            </AdminCard>
          )}
        </section>
      </div>
    </main>
  );
}
