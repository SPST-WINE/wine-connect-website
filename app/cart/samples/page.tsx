export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ArrowRight, Trash2 } from "lucide-react";

/** Fetch current buyer, open SAMPLE cart and items */
async function getData() {
  const supa = createSupabaseServer();

  // who is logged in
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return { user: null, buyer: null, cart: null, items: [] as any[], total: 0 };

  const { data: buyer } = await supa
    .from("buyers")
    .select("id, email, company_name")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!buyer) return { user, buyer: null, cart: null, items: [] as any[], total: 0 };

  // open SAMPLE cart for this buyer
  const { data: cart } = await supa
    .from("carts")
    .select("id, status, type")
    .eq("buyer_id", buyer.id)
    .eq("type", "sample")
    .eq("status", "open")
    .maybeSingle();

  if (!cart) return { user, buyer, cart: null, items: [] as any[], total: 0 };

  // items + wine info (image/name/winery)
  const { data: items } = await supa
    .from("cart_items")
    .select(`
      id,
      quantity,
      unit_price,
      list_type,
      wine:wine_id (
        id,
        wine_name,
        winery_name,
        region,
        type,
        vintage,
        image_url
      )
    `)
    .eq("cart_id", cart.id)
    .order("id", { ascending: true });

  const total =
    (items || []).reduce((sum, it: any) => sum + (Number(it.unit_price ?? 0) * Number(it.quantity ?? 0)), 0) ?? 0;

  return { user, buyer, cart, items: items || [], total };
}

export default async function SampleCartPage() {
  const { buyer, cart, items, total } = await getData();

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)",
      }}
    >
      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-5">
        <Link href="/buyer-home" className="flex items-center gap-2 text-white">
          <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
          <span className="font-semibold">Wine Connect</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link className="text-white/80 hover:text-white" href="/catalog">
            Catalog
          </Link>
          <Link className="text-white/80 hover:text-white" href="/profile">
            Profile
          </Link>
        </nav>
      </header>

      <main className="px-5">
        <div className="mx-auto max-w-6xl py-6">
          {/* Heading */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/60">
                Sample cart
              </div>
              <h1 className="text-3xl font-extrabold text-white">
                {buyer?.company_name || "Your cart"}
              </h1>
              <p className="text-white/70 text-sm">
                {items.length} item{items.length === 1 ? "" : "s"} • Total €{total.toFixed(2)}
              </p>
            </div>

            {items.length > 0 && cart && (
              <form action="/api/cart/checkout" method="post">
                {/* server route reads open sample cart by user; no hidden needed */}
                <button
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-[#0f1720]"
                  style={{ background: "#E33955" }}
                >
                  Request shipment <span className="inline-block -mr-1 pl-1"><ArrowRight size={14} /></span>
                </button>
              </form>
            )}
          </div>

          {/* List */}
          <div className="mt-6 grid gap-3">
            {items.map((it: any) => {
              const w = it.wine || {};
              return (
                <div
                  key={it.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex items-center gap-4"
                >
                  <div className="w-24 h-24 rounded-lg bg-black/30 overflow-hidden grid place-items-center">
                    {w.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={w.image_url}
                        alt={w.wine_name || "Wine"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="text-white/30 text-xs">No image</div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-white truncate">
                      {w.wine_name}{" "}
                      {w.vintage ? <span className="text-white/60">({w.vintage})</span> : null}
                    </div>
                    <div className="text-sm text-white/70 truncate">
                      {w.winery_name} · {w.region} · {w.type}
                    </div>
                    <div className="text-sm text-white mt-1">
                      <span className="text-white/70">Sample price:</span> €{Number(it.unit_price ?? 0).toFixed(2)}
                    </div>
                  </div>

                  {/* Update qty */}
                  <form action="/api/cart/item/update" method="post" className="flex items-center gap-2">
                    <input type="hidden" name="itemId" value={it.id} />
                    <label className="sr-only" htmlFor={`qty-${it.id}`}>Qty</label>
                    <input
                      id={`qty-${it.id}`}
                      name="qty"
                      type="number"
                      min={0}
                      defaultValue={it.quantity}
                      className="w-20 rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white"
                    />
                    <button
                      className="rounded-lg border border-white/10 px-3 py-2 text-sm text-white/90 hover:bg-white/5"
                      title="Update quantity"
                    >
                      Update
                    </button>
                  </form>

                  {/* Remove */}
                  <form action="/api/cart/item/remove" method="post">
                    <input type="hidden" name="itemId" value={it.id} />
                    <button
                      className="rounded-lg border border-white/10 px-2 py-2 text-white/80 hover:bg-white/5"
                      title="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </form>
                </div>
              );
            })}

            {items.length === 0 && (
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center text-white/70">
                Your sample cart is empty.{" "}
                <Link href="/catalog" className="underline">
                  Go to catalog
                </Link>
                .
              </div>
            )}
          </div>

          {/* Summary card */}
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-white/80 text-sm">Subtotal</div>
            <div className="text-white font-semibold">€{total.toFixed(2)}</div>
          </div>

          {/* CTA (bottom duplicated) */}
          {items.length > 0 && cart && (
            <div className="mt-4 text-right">
              <form action="/api/cart/checkout" method="post">
                <button
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-[#0f1720]"
                  style={{ background: "#E33955" }}
                >
                  Request shipment <span className="inline-block -mr-1 pl-1"><ArrowRight size={14} /></span>
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}
