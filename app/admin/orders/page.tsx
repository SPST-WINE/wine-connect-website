// app/admin/orders/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

// UI components (quelli che abbiamo già introdotto nella sezione admin)
import AdminTopbar from "@/components/admin/AdminTopbar";
import AdminFooter from "@/components/admin/AdminFooter";


type Carrier = {
  code: string;
  name: string;
  active: boolean | null;
};

type BuyerLite = {
  company_name: string | null;
  email: string | null;
};

type OrderItemLite = {
  id: string;
  quantity: number;
  unit_price: number | null;
};

type OrderRow = {
  id: string;
  order_code: string | null;
  buyer_id: string;
  type: "samples" | "order" | "sample" | null;
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  created_at: string;
  tracking_code: string | null;
  carrier_code: string | null;
  totals: number | null;
  buyers: BuyerLite | null;
  order_items: OrderItemLite[];
};

const STATI: OrderRow["status"][] = [
  "pending",
  "processing",
  "shipped",
  "completed",
  "cancelled",
];

function money(n?: number | null) {
  if (n == null) return "€0.00";
  const v = Number(n);
  return `€${v.toFixed(2)}`;
}

export default async function AdminOrdersPage() {
  const { ok } = await requireAdmin();
  if (!ok) {
    return (
      <div className="mt-10 px-5">
        Non autorizzato. <a className="underline" href="/login">Accedi</a>.
      </div>
    );
  }

  const supa = createSupabaseServer();

  // Ordini + buyer + righe (solo per contare e calcolare subtotal se serve)
  const { data: orders } = await supa
    .from("orders")
    .select(
      `
        id, order_code, buyer_id, type, status, created_at, tracking_code, carrier_code, totals,
        buyers:buyer_id(company_name, email),
        order_items(id, quantity, unit_price)
      `
    )
    .order("created_at", { ascending: false }) as unknown as { data: OrderRow[] | null };

  // Corrieri attivi
  const { data: carriers } = await supa
    .from("carriers")
    .select("code,name,active")
    .eq("active", true)
    .order("name", { ascending: true }) as unknown as { data: Carrier[] | null };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "radial-gradient(120% 120% at 50% -10%, #0e2232 0%, #0a1722 60%, #000 140%)" }}>
      {/* Admin chrome */}
      <AdminTopbar active="orders" />

      <main className="flex-1 px-5">
        <div className="mx-auto max-w-6xl py-6 space-y-6">
          <AdminPageHeader
            title="Ordini"
            subtitle="Panoramica ordini, tracking e stato."
            breadcrumbs={[
              { href: "/admin", label: "Admin" },
              { href: "/admin/orders", label: "Orders", current: true },
            ]}
            right={
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white hover:bg-black/50"
              >
                ← Dashboard
              </Link>
            }
          />

          {/* Lista ordini */}
          <div className="grid gap-3">
            {(orders ?? []).map((o) => {
              const buyerName = o.buyers?.company_name || o.buyers?.email || "—";
              const code = o.order_code || `#${o.id.slice(0, 8)}`;
              const itemsCount = o.order_items?.length ?? 0;
              const subtotal =
                o.totals ??
                (o.order_items || []).reduce(
                  (s, it) => s + (Number(it.unit_price) || 0) * (Number(it.quantity) || 0),
                  0
                );

              return (
                <section
                  key={o.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                >
                  {/* Testata card */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div className="text-white font-semibold truncate">
                          {code}
                        </div>
                        <span className="text-white/60">· {(o.type || "order").toString().toUpperCase()}</span>
                      </div>
                      <div className="text-xs text-white/60">
                        {buyerName} · {new Date(o.created_at).toLocaleString()}
                      </div>
                      <div className="text-xs text-white/60">
                        {itemsCount} items · Total {money(subtotal)}
                      </div>
                    </div>

                    <div className="shrink-0">
                      <span className="inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wide
                        border-white/20 text-yellow-300 bg-yellow-500/10"
                      >
                        {o.status}
                      </span>
                    </div>
                  </div>

                  {/* RIGA AZIONI */}
                  <div className="mt-3 flex flex-col lg:flex-row lg:items-center gap-3">
                    <form
                      action="/api/admin/orders/update"
                      method="post"
                      className="flex flex-col sm:flex-row sm:items-center gap-2 flex-1"
                    >
                      <input type="hidden" name="orderId" value={o.id} />
                      <input type="hidden" name="redirect_to" value="/admin/orders" />

                      {/* STATUS */}
                      <label className="inline-flex items-center gap-2">
                        <span className="text-xs text-white/60 w-[64px]">status</span>
                        <select
                          name="status"
                          defaultValue={o.status}
                          className="rounded-lg bg-black/40 border border-white/10 px-2.5 py-1.5 text-sm text-white"
                        >
                          {STATI.map((s) => (
                            <option key={s} value={s} className="bg-[#0a1722]">
                              {s}
                            </option>
                          ))}
                        </select>
                      </label>

                      {/* CARRIER */}
                      <label className="inline-flex items-center gap-2">
                        <span className="text-xs text-white/60 w-[64px]">carrier</span>
                        <select
                          name="carrier_code"
                          defaultValue={o.carrier_code ?? ""}
                          className="min-w-[160px] rounded-lg bg-black/40 border border-white/10 px-2.5 py-1.5 text-sm text-white"
                        >
                          <option value="" className="bg-[#0a1722]">—</option>
                          {(carriers ?? []).map((c) => (
                            <option key={c.code} value={c.code} className="bg-[#0a1722]">
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </label>

                      {/* TRACKING */}
                      <label className="inline-flex items-center gap-2 flex-1">
                        <span className="text-xs text-white/60 w-[64px]">tracking</span>
                        <input
                          name="tracking_code"
                          defaultValue={o.tracking_code ?? ""}
                          placeholder="es. 1Z..."
                          className="flex-1 rounded-lg bg-black/40 border border-white/10 px-3 py-1.5 text-sm text-white placeholder:text-white/40"
                        />
                      </label>

                      <button
                        className="h-9 rounded-lg px-3 font-semibold text-[#0f1720]"
                        style={{ background: "#E33955" }}
                      >
                        Salva
                      </button>

                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="h-9 inline-flex items-center justify-center rounded-lg border border-white/10 px-3 text-sm text-white/85 hover:bg-white/5"
                      >
                        Dettagli →
                      </Link>
                    </form>
                  </div>
                </section>
              );
            })}

            {(orders ?? []).length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center text-white/70">
                Nessun ordine presente.
              </div>
            )}
          </div>
        </div>
      </main>

      <AdminFooter />
    </div>
  );
}
