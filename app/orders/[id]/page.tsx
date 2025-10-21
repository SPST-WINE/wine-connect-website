// app/orders/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Rows3, Truck } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";

/** WC background */
const WC_BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

type Order = {
  id: string;
  buyer_id: string;
  cart_id: string | null;
  status: string;
  type?: string | null;
  created_at: string | null;
  tracking_code?: string | null;
  carrier_code?: string | null;
  shipping_address_id?: string | null;
  totals?: number | null;
  order_code?: string | null;
  // embed
  carrier?: {
    code: string;
    name: string | null;
    tracking_url_template: string | null;
  } | null;
};

type Item = {
  id: string;
  wine_id: string;
  quantity: number;
  unit_price: number | null;
  list_type: string | null;
};

type Wine = {
  id: string;
  name: string | null;
  winery_name: string | null;
  vintage: string | null;
  region: string | null;
  image_url: string | null;
};

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

function buildTrackingUrl(template?: string | null, code?: string | null) {
  if (!template || !code) return null;
  const enc = encodeURIComponent(code);
  // prova a coprire i placeholder più comuni
  const variants = ["{{code}}", "{code}", "{tracking}", "{tracking_number}", "%s"];
  let url = template as string;
  for (const v of variants) {
    if (url.includes(v)) {
      url = url.replace(v, enc);
      return url;
    }
  }
  // se non ha placeholder, append come query (fallback)
  try {
    const u = new URL(template);
    u.searchParams.set("tracking", code);
    return u.toString();
  } catch {
    // non è una URL valida: torna null
    return null;
  }
}

export default async function OrderDetail({ params }: { params: { id: string } }) {
  const supa = createSupabaseServer();

  // Auth
  const {
    data: { user },
  } = await supa.auth.getUser();
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white" style={{ background: WC_BG }}>
        <div className="rounded-xl border border-white/10 bg-white/[0.05] p-6">
          You need to <a className="underline" href="/login">log in</a> to view this order.
        </div>
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
      <div className="min-h-screen flex items-center justify-center text-white" style={{ background: WC_BG }}>
        <div className="rounded-xl border border-white/10 bg-white/[0.05] p-6">Buyer profile not found.</div>
      </div>
    );
  }

  // Ordine + corriere (embed)
  const { data: order, error: orderErr } = await supa
    .from("orders")
    .select(
      `
      id, buyer_id, cart_id, status, type, created_at, tracking_code, carrier_code,
      shipping_address_id, totals, order_code,
      carrier:shipping_carriers!orders_carrier_code_fkey(code, name, tracking_url_template)
    `
    )
    .eq("id", params.id)
    .eq("buyer_id", buyer.id)
    .maybeSingle<Order>();

  if (orderErr || !order) return notFound();

  // Address snapshot
  let address: any = null;
  if (order.shipping_address_id) {
    const { data: addr } = await supa
      .from("addresses")
      .select("label,address,city,zip,country")
      .eq("id", order.shipping_address_id)
      .maybeSingle();
    address = addr || null;
  }

  // Items
  let items: Item[] = [];
  {
    const { data: oi } = await supa
      .from("order_items")
      .select("id, wine_id, quantity, unit_price, list_type")
      .eq("order_id", order.id);
    if (oi?.length) items = oi as Item[];
  }
  if ((!items || items.length === 0) && order.cart_id) {
    const { data: ci } = await supa
      .from("cart_items")
      .select("id, wine_id, quantity, unit_price, list_type")
      .eq("cart_id", order.cart_id);
    items = (ci || []) as Item[];
  }

  // Lookup wines via vw_catalog
  const winesById: Map<string, Wine> = new Map();
  if (items.length > 0) {
    const wineIds = Array.from(new Set(items.map((i) => i.wine_id))).filter(Boolean);
    if (wineIds.length > 0) {
      type CatalogRow = {
        wine_id: string;
        wine_name: string | null;
        winery_name: string | null;
        vintage: string | null;
        region: string | null;
        image_url: string | null;
      };
      const { data: vwc } = await supa
        .from("vw_catalog")
        .select("wine_id, wine_name, winery_name, vintage, region, image_url")
        .in("wine_id", wineIds);
      (vwc as CatalogRow[] | null || []).forEach((r) => {
        winesById.set(r.wine_id, {
          id: r.wine_id,
          name: r.wine_name,
          winery_name: r.winery_name,
          vintage: r.vintage,
          region: r.region,
          image_url: r.image_url,
        });
      });
    }
  }

  const subtotal = items.reduce(
    (acc, it) => acc + (Number(it.unit_price) || 0) * (Number(it.quantity) || 0),
    0
  );
  const totalToShow = order.totals != null ? Number(order.totals) : subtotal;

  const trackingUrl = buildTrackingUrl(order.carrier?.tracking_url_template, order.tracking_code);
  const carrierName = order.carrier?.name || order.carrier_code || "—";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: WC_BG }}>
      {/* Top nav */}
      <header className="h-14 flex items-center justify-between px-5">
        <Link href="/buyer-home" className="flex items-center gap-2 text-white">
          <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
          <span className="font-semibold">Wine Connect</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link className="text-white/80 hover:text-white" href="/catalog">Catalog</Link>
          <Link className="text-white/80 hover:text-white" href="/cart/samples">Sample Cart</Link>
          <Link className="text-white/80 hover:text-white" href="/orders">Orders</Link>
        </nav>
      </header>

      <main className="flex-1 px-5">
        <div className="mx-auto max-w-5xl py-8 space-y-6">
          {/* Header */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs tracking-wider uppercase text-white/60">Order</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-extrabold text-white">
                  #{order.order_code || order.id.slice(0, 8)}{" "}
                  {order.type ? <span className="text-white/70">· {String(order.type).toUpperCase()}</span> : null}
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  {order.created_at ? new Date(order.created_at).toLocaleString() : "—"}
                </p>
              </div>
              <Link
                href="/orders"
                className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white hover:bg-black/50"
              >
                <ArrowLeft size={16} /> Back to orders
              </Link>
            </div>
          </section>

          {/* Summary */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-xs uppercase tracking-wider text-white/60">Status</div>
                <div className="mt-1">
                  <StatusBadge status={order.status} />
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-xs uppercase tracking-wider text-white/60">Tracking</div>
                <div className="mt-1 text-sm text-white flex flex-col gap-1">
                  {order.tracking_code ? (
                    <>
                      <div className="inline-flex items-center gap-2">
                        <Truck size={16} className="opacity-80" />
                        <span className="font-medium">{order.tracking_code}</span>
                      </div>
                      <div className="text-white/80 text-xs">
                        Carrier: <span className="font-medium">{carrierName}</span>
                        {trackingUrl ? (
                          <>
                            {" · "}
                            <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="underline">
                              Track on carrier site
                            </a>
                          </>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    "—"
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/30 p-4">
                <div className="text-xs uppercase tracking-wider text-white/60">Total</div>
                <div className="mt-1 text-sm text-white">€ {totalToShow.toFixed(2)}</div>
              </div>
            </div>

            {/* Address */}
            <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
              <div className="text-xs uppercase tracking-wider text-white/60">Shipping address</div>
              <div className="mt-1 text-sm text-white/90">
                {address ? (
                  <>
                    <div className="font-semibold">{address.label || "—"}</div>
                    <div>{address.address || "—"}</div>
                    <div>
                      {(address.zip || "—")}, {(address.city || "—")} — {(address.country || "—")}
                    </div>
                  </>
                ) : (
                  "—"
                )}
              </div>
            </div>
          </section>

          {/* Items */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] tracking-wider uppercase text-white/60">Order lines</div>
                <h3 className="mt-1 text-xl md:text-2xl font-extrabold text-white">Items</h3>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white hover:bg-black/50"
              >
                <Rows3 size={16} /> Go to catalog
              </Link>
            </div>

            {items.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
                No items found for this order.
              </div>
            ) : (
              <ul className="mt-4 grid gap-3">
                {items.map((it) => {
                  const w = winesById.get(it.wine_id);
                  const unit = Number(it.unit_price) || 0;
                  const qty = Number(it.quantity) || 0;
                  return (
                    <li key={it.id} className="rounded-xl border border-white/10 bg-black/30 p-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded bg-white/10 overflow-hidden shrink-0">
                          {w?.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={w.image_url} alt={w?.name || "Wine"} className="h-full w-full object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-white truncate">
                            {(w?.name || "Wine")} {w?.vintage ? `— ${w.vintage}` : ""}
                          </div>
                          <div className="text-xs text-white/70">
                            {w?.winery_name ? `${w.winery_name} · ` : ""}{w?.region || ""}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-sm">Qty: {qty}</div>
                          <div className="text-white/80 text-xs">€ {unit.toFixed(2)}</div>
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

      {/* Footer */}
      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}
