// app/admin/buyers/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

type Buyer = {
  id: string;
  email: string | null;
  company_name: string | null;
  contact_name: string | null;
  country: string | null;
  created_at: string;
};

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso!;
  }
}

export default async function AdminBuyers({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato.</div>;

  const q = (searchParams?.q ?? "").trim();
  const supa = createSupabaseServer();

  let query = supa
    .from("buyers")
    .select("id,email,company_name,contact_name,country,created_at")
    .order("created_at", { ascending: false });

  if (q) {
    // filtro semplice su company_name o email
    query = query.or(`company_name.ilike.%${q}%,email.ilike.%${q}%`);
  }

  const { data: buyers = [] } = await query;

  return (
    <main className="px-5">
      <div className="mx-auto max-w-6xl py-6 space-y-6">
        {/* Header */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-white/60">
                Admin · Buyers
              </div>
              <h1 className="text-2xl font-bold">Buyers</h1>
              <p className="text-white/70 text-sm">
                Elenco buyer registrati e contatti.
              </p>
            </div>
            <Link
              href="/admin"
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              ← Dashboard
            </Link>
          </div>

          {/* Tabs nav (coerente con le altre pagine admin) */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <Link href="/admin/orders" className="rounded-full bg-white/5 px-2.5 py-1 hover:bg-white/10">
              Orders
            </Link>
            <Link href="/admin/wineries" className="rounded-full bg-white/5 px-2.5 py-1 hover:bg-white/10">
              Wineries
            </Link>
            <Link href="/admin/wines" className="rounded-full bg-white/5 px-2.5 py-1 hover:bg-white/10">
              Wines
            </Link>
            <span className="rounded-full bg-white/10 px-2.5 py-1">Buyers</span>
          </div>

          {/* Search */}
          <form className="mt-4 flex gap-2" action="/admin/buyers" method="get">
            <input
              name="q"
              defaultValue={q}
              placeholder="Cerca per azienda o email…"
              className="h-10 flex-1 rounded-lg border border-white/10 bg-black/30 px-3"
            />
            <button className="h-10 rounded-lg bg-rose-500 px-4 font-semibold text-[#0f1720]">
              Cerca
            </button>
            {q ? (
              <Link
                href="/admin/buyers"
                className="h-10 inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-4 text-sm hover:bg-white/10"
              >
                Pulisci
              </Link>
            ) : null}
          </form>
        </section>

        {/* Lista buyers */}
        <section className="space-y-3">
          {(buyers as Buyer[]).map((b) => {
            return (
              <div
                key={b.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="grid gap-3 md:grid-cols-[1.5fr,1fr,1fr,auto] md:items-center">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      {b.company_name || "—"}
                    </div>
                    <div className="text-sm text-white/70 truncate">
                      {b.contact_name || "—"}
                    </div>
                    <div className="text-xs text-white/50 truncate">
                      {b.email || "—"}
                    </div>
                  </div>

                  <div className="text-sm">
                    <div className="text-white/60 text-xs">Country</div>
                    <div className="font-medium">{b.country || "—"}</div>
                  </div>

                  <div className="text-sm">
                    <div className="text-white/60 text-xs">Registrato</div>
                    <div className="font-medium">{fmtDate(b.created_at)}</div>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/buyers/${b.id}`}
                      className="h-10 inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-4 text-sm hover:bg-white/10"
                    >
                      Dettagli →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {(buyers ?? []).length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-sm text-white/70">
              Nessun buyer trovato{q ? " per la ricerca corrente." : "."}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
