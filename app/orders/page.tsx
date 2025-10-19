// app/orders/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { Rows3, Truck } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

/** WC background */
const WC_BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

type OrderRow = {
  id: string;
  status: string;
  created_at: string | null;
  order_code?: string | null;
  type?: string | null;
  tracking_code?: string | null;
  totals?: number | null;
};

export default async function OrdersPage() {
  const supa = createSupabaseServer();

  // Auth
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col text-white" style={{ background: WC_BG }}>
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-xl border border-white/10 bg-white/[0.05] p-6 text-center">
            You need to <a className="underline" href="/login">log in</a> to view orders.
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  // Buyer
  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!buyer) {
    return (
      <div className="min-h-screen flex flex-col text-white" style={{ background: WC_BG }}>
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-xl border border-white/10 bg-white/[0.05] p-6">
            Buyer profile not found.
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  // Orders list
  const { data: orders, error: ordersErr } = await supa
    .from("orders")
    .select("*")
    .eq("buyer_id", buyer.id)
    .order("created_at", { ascending: false });

  if (ordersErr) {
    return (
      <div className="min-h-screen flex flex-col text-white" style={{ background: WC_BG }}>
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="rounded-xl border border-white/10 bg-white/[0.05] p-6">
            Could not load orders.
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const list = (orders || []) as OrderRow[];

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: WC_BG }}>
      {/* GLOBAL HEADER */}
      <SiteHeader />

      <main className="flex-1 px-5">
        <div className="mx-auto max-w-5xl py-8 space-y-6">
          {/* Header block */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs tracking-wider uppercase text-white/60">
                  Orders
                </div>
                <h1 className="mt-1 text-3xl md:text-4xl font-extrabold">
                  Your orders
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  Review your requests and shipments.
                </p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm hover:bg-black/50"
              >
                <Rows3 size={16} /> Go to catalog
              </Link>
            </div>
          </section>

          {/* Orders list */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            {list.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-black/30 p-5 text-sm text-white/80">
                No orders yet. Start from the{" "}
                <Link href="/catalog" className="underline">
                  catalog
                </Link>{" "}
                or create a brief.
              </div>
            ) : (
              <ul className="grid gap-3">
                {list.map((o) => (
                  <li
                    key={o.id}
                    className="rounded-xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold truncate">
                          #{o.order_code || o.id.slice(0, 8)}{" "}
                          {o.type ? (
                            <span className="text-white/70">
                              · {String(o.type).toUpperCase()}
                            </span>
                          ) : null}
                        </div>
                        <div className="text-xs text-white/70 mt-0.5">
                          {o.created_at
                            ? new Date(o.created_at).toLocaleString()
                            : "—"}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <StatusBadge status={o.status} />
                        {o.tracking_code ? (
                          <a
                            href={`/orders/${o.id}`}
                            className="inline-flex items-center gap-1 text-sm underline"
                          >
                            <Truck size={14} /> Track
                          </a>
                        ) : (
                          <Link href={`/orders/${o.id}`} className="text-sm underline">
                            Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      {/* GLOBAL FOOTER */}
      <SiteFooter />
    </div>
  );
}

/* ============ UI helpers ============ */

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    processing: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    shipped: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
  };
  const cls = map[status] ?? "bg-white/10 text-white/80 border-white/20";
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${cls}`}>
      {String(status).toUpperCase()}
    </span>
  );
}
