// app/admin/buyers/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
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

type OrderItem = {
  quantity: number;
  unit_price: number | null;
  list_type: "sample" | "order";
};

type OrderRow = {
  id: string;
  type: "samples" | "order";
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  created_at: string;
  tracking_code: string | null;
  carrier_code: string | null;
  items: OrderItem[];
};

type Carrier = { code: string; tracking_url_template: string | null };

function fmtDate(iso?: string | null) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso!;
  }
}

function money(n?: number | null) {
  const v = Number(n ?? 0);
  return `€ ${v.toFixed(2)}`;
}

function subtotal(items: OrderItem[]) {
  return items.reduce((acc, it) => acc + (it.unit_price ?? 0) * it.quantity, 0);
}

function buildTrackingUrl(
  carrierCode?: string | null,
  tracking?: string | null,
  carriersMap?: Map<string, string | null>
) {
  if (!carrierCode || !tracking) return null;
  const tpl = carriersMap?.get(carrierCode) ?? null;
  if (!tpl) return null;
  return tpl.replace("{code}", encodeURIComponent(tracking));
}

export default async function AdminBuyerDetail({
  params,
}: {
  params: { id: string };
}) {
  const { ok } = await requireAdmin();
  if (!ok) return <div className="mt-10">Non autorizzato.</div>;

  const supa = createSupabaseServer();

  const [{ data: buyer }, { data: orders }, { data: carriers }] = await Promise.all([
    supa
      .from("buyers")
      .select("id,email,company_name,contact_name,country,created_at")
      .eq("id", params.id)
      .maybeSingle<Buyer>(),
    supa
      .from("orders")
      .select(
        `
        id, type, status, created_at, tracking_code, carrier_code,
        items:order_items(quantity, unit_price, list_type)
      `
      )
      .eq("buyer_id", params.id)
      .order("created_at", { ascending: false }) as any as Promise<{
      data: OrderRow[] | null;
    }>,
    supa
      .from("shipping_carriers")
      .select("code, tracking_url_template")
      .order("code") as any as Promise<{ data: Carrier[] | null }>,
  ]);

  if (!buyer) return notFound();

  const carriersMap = new Map<string, string | null>(
    (carriers ?? []).map((c) => [String(c.code), c.tracking_url_template ?? null])
  );

  return (
    <main className="px-5">
      <div className="mx-auto max-w-6xl py-6 space-y-6">
        {/* Header / Breadcrumb */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-white/60">
                Admin · Buyer
              </div>
              <h1 className="text-2xl font-bold">
                {buyer.company_name || "—"}
              </h1>
              <p className="text-white/70 text-sm">
                {buyer.contact_name || "—"} · {buyer.email || "—"} ·{" "}
                {buyer.country || "—"}
              </p>
            </div>
            <Link
              href="/admin/buyers"
              className="rounded-lg border border-white/10 bg-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
            >
              ← Back to buyers
            </Link>
          </div>
        </section>

        {/* Info card */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-white/60 text-xs">Company</div>
            <div className="font-semibold">
              {buyer.company_name || "—"}
            </div>
          </div>
          <div>
            <div className="text-white/60 text-xs">Contact</div>
            <div className="font-semibold">
              {buyer.contact_name || "—"}
            </div>
          </div>
          <div>
            <div className="text-white/60 text-xs">Email</div>
            <div className="font-semibold">
              {buyer.email ? (
                <a className="underline" href={`mailto:${buyer.email}`}>
                  {buyer.email}
                </a>
              ) : (
                "—"
              )}
            </div>
          </div>
          <div>
            <div className="text-white/60 text-xs">Country</div>
            <div className="font-semibold">{buyer.country || "—"}</div>
          </div>
          <div>
            <div className="text-white/60 text-xs">Created at</div>
            <div className="font-semibold">{fmtDate(buyer.created_at)}</div>
          </div>
        </section>

        {/* Orders list */}
        <section className="space-y-3">
          <div className="text-[11px] uppercase tracking-wider text-white/60">
            Orders
          </div>

          {(orders ?? []).map((o) => {
            const total = subtotal(o.items || []);
            const trackUrl = buildTrackingUrl(
              o.carrier_code,
              o.tracking_code,
              carriersMap
            );
            return (
              <div
                key={o.id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <div className="grid gap-4 md:grid-cols-[1.5fr,1fr,1fr,auto] md:items-center">
                  {/* Left: id + type + created */}
                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      #{o.id.slice(0, 8)} · {o.type.toUpperCase()}
                    </div>
                    <div className="text-sm text-white/70">
                      {fmtDate(o.created_at)}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-white/10 px-2 py-1">
                        {o.status.toUpperCase()}
                      </span>
                      {o.tracking_code ? (
                        <span className="rounded-full bg-white/10 px-2 py-1">
                          Tracking {o.tracking_code}
                        </span>
                      ) : null}
                      {o.carrier_code ? (
                        <span className="rounded-full bg-white/10 px-2 py-1">
                          Carrier {o.carrier_code}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Total */}
                  <div>
                    <div className="text-white/60 text-xs">Subtotal</div>
                    <div className="font-semibold">{money(total)}</div>
                  </div>

                  {/* Tracking link */}
                  <div>
                    <div className="text-white/60 text-xs">Tracking</div>
                    {trackUrl ? (
                      <a
                        href={trackUrl}
                        target="_blank"
                        className="inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10"
                      >
                        Apri tracking {o.carrier_code}
                      </a>
                    ) : (
                      <div className="text-sm text-white/60">—</div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex justify-end">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="h-10 inline-flex items-center rounded-lg border border-white/10 bg-white/5 px-4 text-sm hover:bg-white/10"
                    >
                      Vai all’ordine →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {(orders ?? []).length === 0 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center text-sm text-white/70">
              Nessun ordine per questo buyer.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
