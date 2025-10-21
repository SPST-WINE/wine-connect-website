// app/admin/orders/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/is-admin";
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminFooter from "@/components/admin/AdminFooter";
import StatusPill from "@/components/admin/StatusPill";
import { Package, ArrowRight } from "lucide-react";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #0f2740 0%, #0a1722 60%, #000 140%)";

type BuyerLite = {
  company_name: string | null;
  email: string | null;
};

type OrderRow = {
  id: string;
  order_code: string | null;
  created_at: string;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "completed"
    | "cancelled";
  type: "samples" | "order" | string | null;
  tracking_code: string | null;
  totals: number | null;
  buyers: BuyerLite | null;
  items_count?: number | null;
};

export default async function AdminOrdersPage() {
  const { ok } = await requireAdmin();
  if (!ok) {
    return (
      <div className="mt-10">
        Non autorizzato. <Link className="underline" href="/login">Accedi</Link>.
      </div>
    );
  }

  const supa = createSupabaseServer();

  // prendiamo gli ordini con buyer e un conteggio righe
  // NB: order_items(count) funziona come "aggregate" su PostgREST
  const { data: rows } = await supa
    .from("orders")
    .select(
      `
      id, order_code, created_at, status, type, tracking_code, totals,
      buyers:buyer_id(company_name,email),
      order_items(count)
    `
    )
    .order("created_at", { ascending: false });

  // normalizziamo il conteggio
  const orders: OrderRow[] = (rows || []).map((r: any) => ({
    ...r,
    items_count: r?.order_items?.[0]?.count ?? null,
  }));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>
      {/* Topbar admin */}
      <AdminTopbar active="orders" />

      <main className="flex-1 px-5">
        <div className="mx-auto max-w-6xl py-6 space-y-6">
          {/* Header */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-white/60">
                  Admin · Orders
                </div>
                <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-white">
                  Ordini
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  Panoramica ordini, tracking e stato.
                </p>
              </div>
              <nav className="flex gap-2">
                <Link
                  href="/admin"
                  className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white hover:bg-black/50"
                >
                  ← Dashboard
                </Link>
              </nav>
            </div>
          </section>

          {/* Lista ordini */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 md:p-5">
            {orders.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-white/80">
                Nessun ordine presente.
              </div>
            ) : (
              <ul className="grid gap-3">
                {orders.map((o) => {
                  const code = o.order_code || o.id.slice(0, 8);
                  const buyer =
                    o.buyers?.company_name ||
                    o.buyers?.email ||
                    "—";
                  const when = new Date(o.created_at).toLocaleString();
                  const total =
                    o.totals != null ? `€${Number(o.totals).toFixed(2)}` : "—";

                  return (
                    <li
                      key={o.id}
                      className="rounded-xl border border-white/10 bg-black/30 p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* sinistra: info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 text-white font-semibold">
                            <Package size={16} className="opacity-80" />
                            <span className="truncate">
                              #{code}{" "}
                              {o.type ? (
                                <span className="text-white/70">
                                  · {String(o.type).toUpperCase()}
                                </span>
                              ) : null}
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-white/70 truncate">
                            {buyer} • {when}
                          </div>
                          <div className="mt-1 text-xs text-white/60">
                            {o.items_count != null
                              ? `${o.items_count} items`
                              : "—"}
                            {" · "}Total: {total}
                          </div>
                        </div>

                        {/* destra: stato, tracking e azioni */}
                        <div className="flex flex-col gap-2 md:items-end shrink-0">
                          <StatusPill status={o.status} />
                          <div className="flex items-center gap-2">
                            <form
                              action="/api/admin/orders/update"
                              method="post"
                              className="flex items-center gap-2"
                            >
                              <input type="hidden" name="orderId" value={o.id} />
                              <select
                                name="status"
                                defaultValue={o.status}
                                className="rounded-lg bg-black/30 border border-white/10 px-2 py-1 text-white text-sm"
                              >
                                <option value="pending" className="bg-[#0a1722]">
                                  pending
                                </option>
                                <option value="processing" className="bg-[#0a1722]">
                                  processing
                                </option>
                                <option value="shipped" className="bg-[#0a1722]">
                                  shipped
                                </option>
                                <option value="completed" className="bg-[#0a1722]">
                                  completed
                                </option>
                                <option value="cancelled" className="bg-[#0a1722]">
                                  cancelled
                                </option>
                              </select>

                              <input
                                type="text"
                                name="tracking_code"
                                placeholder="Tracking"
                                defaultValue={o.tracking_code || ""}
                                className="w-[180px] rounded-lg bg-black/30 border border-white/10 px-2 py-1 text-white text-sm placeholder:text-white/40"
                              />

                              <button className="rounded-lg border border-white/10 bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/15">
                                Salva
                              </button>
                            </form>

                            <Link
                              href={`/admin/orders/${o.id}`}
                              className="inline-flex items-center gap-1 rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-black/50"
                            >
                              Dettagli <ArrowRight size={14} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>

      <AdminFooter />
    </div>
  );
}
