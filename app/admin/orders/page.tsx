// app/admin/orders/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import StatusPill from "@/components/admin/StatusPill";

type OrderRow = {
  id: string;
  buyer_id: string | null;
  order_code: string | null;
  type: "sample" | "order" | string | null;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  created_at: string;
  tracking_code: string | null;
  totals: number | null;
  items_count?: number | null;
  buyers?: { company_name: string | null } | null;
};

export default async function AdminOrdersPage() {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato.</div>;

  const supa = createSupabaseServer();

  // Carico ordini + count righe
  const { data: orders } = await supa
    .from("orders")
    .select(
      `
      id, order_code, type, status, created_at, tracking_code, totals, buyer_id,
      buyers:buyer_id(company_name),
      items_count:order_items(count)
    `
    )
    .order("created_at", { ascending: false }) as unknown as {
      data: (OrderRow & { items_count: { count: number }[] })[] | null;
    };

  const list: OrderRow[] =
    (orders || []).map((o) => ({
      ...o,
      items_count:
        (Array.isArray(o.items_count) && o.items_count[0]?.count) || 0,
    })) as any;

  return (
    // Il layout admin gestisce già background/topbar/footer; qui solo il contenuto
    <div className="px-5">
      <div className="mx-auto max-w-6xl py-6 space-y-6">
        {/* Intestazione sezione */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] tracking-wider uppercase text-white/60">
                Admin · Orders
              </div>
              <h1 className="mt-1 text-2xl md:text-3xl font-extrabold text-white">
                Ordini
              </h1>
              <p className="mt-1 text-sm text-white/70">
                Orders, tracking and status.
              </p>
            </div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white hover:bg-black/50"
            >
              ← Dashboard
            </Link>
          </div>
        </section>

        {/* Lista ordini */}
        <section className="space-y-3">
          {(list || []).map((o) => (
            <article
              key={o.id}
              className="rounded-xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex flex-col gap-3">
                {/* Riga titolo */}
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-white font-medium truncate">
                      <span className="opacity-80">
                        #{o.order_code || o.id.slice(0, 8)}
                      </span>
                      {o.type ? (
                        <span className="text-white/60">
                          · {String(o.type).toUpperCase()}
                        </span>
                      ) : null}
                    </div>
                    <div className="text-xs text-white/60 mt-0.5 truncate">
                      {o.buyers?.company_name || "—"} ·{" "}
                      {new Date(o.created_at).toLocaleString()}
                    </div>
                    <div className="text-xs text-white/60">
                      {(o.items_count as any as number) || 0} items · Total €
                      {Number(o.totals ?? 0).toFixed(2)}
                    </div>
                  </div>

                  <StatusPill status={o.status} />
                </div>

                {/* Azioni */}
                <div className="flex flex-wrap items-center gap-2">
                  <form
                    action="/api/admin/orders/update"
                    method="post"
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="orderId" value={o.id} />
                    <select
                      name="status"
                      defaultValue={o.status}
                      className="rounded-lg bg-black/30 border border-white/10 px-2 py-1.5 text-sm text-white"
                    >
                      {["pending", "processing", "shipped", "completed", "cancelled"].map(
                        (s) => (
                          <option key={s} value={s} className="bg-[#0a1722]">
                            {s}
                          </option>
                        )
                      )}
                    </select>
                    <input
                      name="tracking_code"
                      defaultValue={o.tracking_code ?? ""}
                      placeholder="Tracking"
                      className="rounded-lg bg-black/30 border border-white/10 px-2 py-1.5 text-sm text-white w-48"
                    />
                    <button className="rounded-lg bg-white/10 border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-white/15">
                      Salva
                    </button>
                  </form>

                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="ml-auto inline-flex items-center gap-1 rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-sm text-white hover:bg-black/50"
                  >
                    Dettagli →
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {(list || []).length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5 text-center text-white/70">
              Nessun ordine presente.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
