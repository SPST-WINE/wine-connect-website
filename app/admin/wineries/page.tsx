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
  if (!ok) {
    return (
      <main className="flex-1 px-5 grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center">
          Non autorizzato.
        </div>
      </main>
    );
  }

  const supa = createSupabaseServer();
  const { data: wineries } = await supa
    .from("wineries")
    .select("id,name,region,country,website,active,logo_url")
    .order("name", { ascending: true });

  const list = wineries ?? [];

  return (
    <main className="flex-1 px-5">
      <div className="mx-auto max-w-[1200px] py-6 space-y-6">
        {/* Header */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/60">Admin</div>
            <h1 className="mt-1 text-3xl md:text-4xl font-extrabold">Wineries</h1>
            <p className="mt-1 text-sm text-white/70">
              Manage producer records and assets.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="rounded-xl border border-white/10 px-3 py-2 text-sm text-white/85 hover:bg-white/5"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/wineries/new"
              className="rounded-xl px-3 py-2 font-semibold text-[#0f1720]"
              style={{ background: "#E33955" }}
            >
              + New winery
            </Link>
          </div>
        </section>

        {/* List */}
        <section className="grid gap-3">
          {list.map((w) => (
            <article
              key={w.id}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={w.logo_url || "/placeholder.png"}
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover bg-black/30 border border-white/10"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white truncate">{w.name}</div>
                  <div className="text-sm text-white/70 truncate">
                    {[w.region, w.country].filter(Boolean).join(" · ") || "—"}
                    {w.website ? (
                      <>
                        {" · "}
                        <a
                          className="underline"
                          href={w.website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          site
                        </a>
                      </>
                    ) : null}
                  </div>
                  <div className="text-[11px] mt-1">
                    <span
                      className={[
                        "inline-block rounded-full px-2 py-0.5 border",
                        w.active
                          ? "border-emerald-400/30 text-emerald-200 bg-emerald-500/10"
                          : "border-white/20 text-white/70 bg-white/5",
                      ].join(" ")}
                    >
                      {w.active ? "Active" : "Disabled"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/admin/wineries/${w.id}`}
                    className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white/90 hover:bg-white/5"
                  >
                    Edit
                  </Link>
                  <form action="/api/admin/wineries/delete" method="post">
                    <input type="hidden" name="id" value={w.id} />
                    <ConfirmSubmit
                      confirmMessage="Eliminare la cantina?"
                      className="px-3 py-1.5 rounded-lg border border-red-500/40 text-red-200 text-sm hover:bg-red-500/10"
                    >
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </div>
            </article>
          ))}

          {list.length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-sm text-white/80">
              Nessuna cantina presente.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
