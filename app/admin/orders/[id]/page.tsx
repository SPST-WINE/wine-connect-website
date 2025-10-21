// app/admin/orders/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound, headers } from "next/navigation";
import { requireAdmin } from "@/lib/is-admin";
import { createSupabaseServer } from "@/lib/supabase/server";

type Carrier = { code: string; name: string; tracking_url: string | null };
type OrderItem = {
  id: string;
  wine_id: string;
  quantity: number;
  unit_price: number | null;
  list_type: "sample" | "order";
  wines: { name: string; vintage: string | null; image_url: string | null } | null;
};
type OrderRow = {
  id: string;
  buyer_id: string | null;
  type: "samples" | "order";
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  created_at: string;
  tracking_code: string | null;
  carrier_code: string | null;
  notes: string | null;
  buyers: { email: string | null; company_name: string | null } | null;
  items: OrderItem[];
};

const STATI: OrderRow["status"][] = ["pending", "processing", "shipped", "completed", "cancelled"];

function money(n: number | null | undefined) {
  if (n == null) return "€0.00";
  return `€ ${n.toFixed(2)}`;
}
const j = (v: any) => {
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
};

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const h = headers();
  const url = h.get("x-vercel-deployment-url") || h.get("host") || "";
  const referer = h.get("referer") || "";
  const ts = new Date().toISOString();
  const debug = (h.get("x-next-debug") || "").includes("1") || (h.get("next-url") || "").includes("debug=1");

  console.log("[ADMIN/ORDER] ► start", { ts, id: params.id, host: url, referer });

  // 1) Auth admin
  const gate = await requireAdmin();
  console.log("[ADMIN/ORDER] requireAdmin()", gate);
  if (!gate.ok) {
    console.warn("[ADMIN/ORDER] forbidden");
    return (
      <div className="p-6 text-white/90">
        Non autorizzato. <Link className="underline" href="/login">Accedi</Link>.
      </div>
    );
  }

  try {
    const supa = createSupabaseServer();

    // (opzionale) log utente
    const { data: authUser } = await supa.auth.getUser();
    console.log("[ADMIN/ORDER] auth.getUser()", { userId: authUser?.user?.id || null });

    // 2) Ordine
    console.log("[ADMIN/ORDER] fetching order…", params.id);
    const { data: order, error } = await supa
      .from("orders")
      .select(
        `
        id, buyer_id, type, status, created_at, tracking_code, carrier_code, notes,
        buyers:buyer_id(email, company_name),
        items:order_items(
          id, wine_id, quantity, unit_price, list_type,
          wines:wine_id(name, vintage, image_url)
        )
      `
      )
      .eq("id", params.id)
      .single<OrderRow>();

    if (error || !order) {
      console.error("[ADMIN/ORDER] order query error", { error: j(error), id: params.id });
      if (debug) {
        return (
          <div className="p-6 text-white">
            <h1 className="text-xl font-bold mb-3">Debug: order not found</h1>
            <pre className="rounded bg-black/60 p-3 border border-white/10 text-xs">
              {j({ params, error })}
            </pre>
            <p className="mt-3">
              <a className="underline" href="/admin/orders">
                ← back to list
              </a>
            </p>
          </div>
        );
      }
      return notFound();
    }
    console.log("[ADMIN/ORDER] order ok", { id: order.id, items: order.items.length });

    // 3) Carrier
    const { data: carriers, error: carrErr } = (await supa
      .from("shipping_carriers")
      .select("code,name,tracking_url")
      .order("name", { ascending: true })) as unknown as { data: Carrier[] | null; error: any };
    if (carrErr) {
      console.error("[ADMIN/ORDER] carriers error", j(carrErr));
    } else {
      console.log("[ADMIN/ORDER] carriers", carriers?.length ?? 0);
    }

    const subtotal = order.items.reduce((acc, it) => acc + (it.unit_price ?? 0) * it.quantity, 0);

    const badge =
      order.status === "pending"
        ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
        : order.status === "processing"
        ? "bg-blue-500/20 text-blue-200 border-blue-500/30"
        : order.status === "shipped"
        ? "bg-teal-500/20 text-teal-200 border-teal-500/30"
        : order.status === "completed"
        ? "bg-emerald-500/20 text-emerald-200 border-emerald-500/30"
        : "bg-red-500/20 text-red-200 border-red-500/30";

    return (
      <div className="px-5 py-6 text-white">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/60">Admin · Order</div>
                <h1 className="text-2xl font-extrabold mt-1">#{order.id.slice(0, 8)} · {order.type.toUpperCase()}</h1>
                <div className="mt-1 text-sm text-white/70">
                  {new Date(order.created_at).toLocaleString()} — {order.buyers?.company_name || order.buyers?.email || "—"}
                </div>
              </div>
              <Link
                href="/admin/orders"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
              >
                ← Back to orders
              </Link>
            </div>
          </div>

          {/* Testata */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <section className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-4 md:col-span-2">
              <div className="text-[11px] uppercase tracking-wider text-white/60">Status & Tracking</div>
              <form
                action="/api/admin/orders/update"
                method="post"
                className="mt-3 grid gap-3 md:grid-cols-[220px,1fr,140px,120px] items-end"
              >
                <input type="hidden" name="orderId" value={order.id} />
                <label className="grid gap-1">
                  <span className="text-xs text-white/70">Status</span>
                  <select name="status" defaultValue={order.status} className="rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white">
                    {STATI.map((s) => (
                      <option key={s} value={s} className="bg-[#0a1722]">
                        {s}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-white/70">Tracking code</span>
                  <input
                    name="tracking_code"
                    defaultValue={order.tracking_code ?? ""}
                    className="rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white"
                    placeholder="es. 1Z..."
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-xs text-white/70">Carrier</span>
                  <select
                    name="carrier_code"
                    defaultValue={order.carrier_code ?? ""}
                    className="rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white"
                  >
                    <option value="" className="bg-[#0a1722]">— Nessuno —</option>
                    {(carriers ?? []).map((c) => (
                      <option key={c.code} value={c.code} className="bg-[#0a1722]">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button className="h-10 rounded-lg px-4 font-semibold text-[#0f1720]" style={{ background: "#E33955" }}>
                  Salva
                </button>
              </form>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                <span className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${badge}`}>
                  {order.status.toUpperCase()}
                </span>

                {order.tracking_code ? (
                  <TrackingPreview code={order.tracking_code} carrierCode={order.carrier_code} carriers={carriers ?? []} />
                ) : null}

                <div className="ml-auto font-semibold">{money(subtotal)}</div>
              </div>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-4">
              <div className="text-[11px] uppercase tracking-wider text-white/60">Total</div>
              <div className="mt-2 text-2xl font-extrabold">{money(subtotal)}</div>
              <div className="text-xs text-white/60 mt-1">(item x qty, tasse/sped. non incluse)</div>
            </section>
          </div>

          {/* Items */}
          <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-4">
            <div className="text-[11px] uppercase tracking-wider text-white/60 mb-3">Items</div>
            <ul className="grid gap-3">
              {order.items.map((it) => {
                const img = it.wines?.image_url;
                const line = (it.unit_price ?? 0) * it.quantity;
                return (
                  <li key={it.id} className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/20 p-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-black/30 shrink-0 grid place-items-center border border-white/10">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          img ||
                          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23121a23'/></svg>"
                        }
                        alt=""
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">
                        {it.wines?.name || "—"} {it.wines?.vintage ? `(${it.wines.vintage})` : ""}
                      </div>
                      <div className="text-xs text-white/70">
                        {it.list_type.toUpperCase()} • {money(it.unit_price)} cad.
                      </div>
                    </div>
                    <div className="text-sm text-white/80 w-28">Qty: {it.quantity}</div>
                    <div className="w-28 text-right font-semibold">{money(line)}</div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    );
  } catch (e: any) {
    console.error("[ADMIN/ORDER] fatal error", j({ id: params.id, error: e?.message || e }));
    if (debug) {
      return (
        <div className="p-6 text-white">
          <h1 className="text-xl font-bold mb-3">Debug: fatal error</h1>
          <pre className="rounded bg-black/60 p-3 border border-white/10 text-xs">{j(e)}</pre>
          <p className="mt-3">
            <a className="underline" href="/admin/orders">← back to list</a>
          </p>
        </div>
      );
    }
    return notFound();
  }
}

/** Mini componente per costruire il link di tracking */
function TrackingPreview({
  code,
  carrierCode,
  carriers,
}: {
  code: string;
  carrierCode: string | null;
  carriers: Carrier[];
}) {
  const c = carriers.find((k) => k.code === carrierCode);
  const href =
    c?.tracking_url && c.tracking_url.includes("{CODE}")
      ? c.tracking_url.replace("{CODE}", encodeURIComponent(code))
      : null;

  return href ? (
    <a
      href={href}
      target="_blank"
      className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 hover:bg-black/40"
    >
      <span className="text-white/60 text-xs">TRACKING</span>
      <span className="font-medium">{code}</span>
      <span className="text-white/50 text-xs">({c?.name})</span>
    </a>
  ) : (
    <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1">
      <span className="text-white/60 text-xs">TRACKING</span>
      <span className="font-medium">{code}</span>
      {carrierCode ? <span className="text-white/50 text-xs">({c?.name || carrierCode})</span> : null}
    </span>
  );
}
