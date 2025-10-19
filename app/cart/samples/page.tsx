// app/cart/samples/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ShippingAddressPicker from "@/components/cart/ShippingAddressPicker";

export default async function SamplesCart() {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  const BG =
    "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

  // ===== not logged in =====
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col text-white" style={{ background: BG }}>
        <SiteHeader />
        <main className="flex-1 px-5">
          <div className="mx-auto max-w-6xl py-10">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white/80">
              You must <a className="underline" href="/login">sign in</a>.
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // ===== buyer ====
  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();

  if (!buyer) {
    return (
      <div className="min-h-screen flex flex-col text-white" style={{ background: BG }}>
        <SiteHeader />
        <main className="flex-1 px-5">
          <div className="mx-auto max-w-6xl py-10">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white/80">
              Buyer profile not found.
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  // open cart
  const { data: carts } = await supa
    .from("carts")
    .select("id")
    .eq("buyer_id", buyer.id)
    .eq("type", "sample")
    .eq("status", "open")
    .limit(1);
  const cartId = carts?.[0]?.id;

  // items (aggiungo region + alcohol per i dettagli)
  const { data: items } = cartId
    ? await supa
        .from("cart_items")
        .select(
          `
          id,
          quantity,
          unit_price,
          list_type,
          wines (
            id,
            name,
            vintage,
            region,
            alcohol,
            image_url
          )
        `
        )
        .eq("cart_id", cartId)
    : { data: [] as any[] };

  // addresses (aggiungo city/zip per dettaglio + caret custom)
  const { data: addresses } = await supa
    .from("addresses")
    .select("id,label,address,city,zip,country,is_default,created_at")
    .eq("buyer_id", buyer.id)
    .eq("is_active", true)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true });

  const defaultAddressId =
    addresses?.find((a) => a.is_default)?.id ||
    addresses?.[0]?.id ||
    "";

  const subtotal = (items || []).reduce(
    (s: number, i: any) => s + i.quantity * Number(i.unit_price || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: BG }}>
      {/* GLOBAL HEADER */}
      <SiteHeader />

      <main className="flex-1 px-5">
        <div className="mx-auto max-w-6xl py-6">
          {/* Heading */}
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/60">
                Sample cart
              </div>
              <h1 className="text-3xl font-extrabold">Your cart</h1>
              <p className="text-white/70 text-sm">
                {(items?.length || 0)} items · Total €{subtotal.toFixed(2)}
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm hover:bg-white/15"
            >
              Back to catalog
            </Link>
          </div>

          {/* Empty state */}
          {!cartId || !items || items.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center text-white/70">
              Your sample cart is empty.{" "}
              <Link href="/catalog" className="underline">
                Go to catalog
              </Link>
              .
            </div>
          ) : (
            <>
              {/* Items */}
              <ul className="mt-6 grid gap-3">
                {(items || []).map((it: any) => {
                  const w = it.wines || {};
                  const img = w?.image_url || null;
                  const name = w?.name || "Wine";
                  const title =
                    name + (w?.vintage ? ` (${w.vintage})` : "");
                  const lineTotal =
                    Number(it.unit_price || 0) * Number(it.quantity || 0);

                  return (
                    <li
                      key={it.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex items-center gap-3"
                    >
                      <Link
                        href={`/wines/${w?.id}`}
                        className="w-16 h-16 rounded-lg border border-white/10 overflow-hidden shrink-0 bg-black/30"
                      >
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-[11px] text-white/40">
                            No image
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">
                          <Link href={`/wines/${w?.id}`} className="hover:underline">
                            {title}
                          </Link>
                        </div>
                        {/* meta: vintage (separato), alcohol %, region */}
                        <div className="text-xs text-white/70 mt-0.5">
                          {w?.vintage ? `${w.vintage}` : "—"}
                          {w?.alcohol != null ? ` · ${Number(w.alcohol)}% alc.` : ""}
                          {w?.region ? ` · ${w.region}` : ""}
                        </div>
                        <div className="text-sm text-white/70">
                          €{Number(it.unit_price || 0).toFixed(2)} each
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <form
                          action="/api/cart/item/update"
                          method="post"
                          className="flex items-center gap-2"
                        >
                          <input type="hidden" name="itemId" value={it.id} />
                          <input
                            name="qty"
                            type="number"
                            min={0}
                            defaultValue={it.quantity}
                            className="w-16 rounded-lg bg-black/30 border border-white/10 px-2 py-1 text-right"
                          />
                          <button className="px-3 py-1.5 rounded-lg bg-black text-white text-sm hover:-translate-y-[1px] transition">
                            Update
                          </button>
                        </form>

                        <form action="/api/cart/item/remove" method="post">
                          <input type="hidden" name="itemId" value={it.id} />
                          <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm hover:bg-white/5">
                            Remove
                          </button>
                        </form>

                        <div className="w-24 text-right font-medium">
                          €{lineTotal.toFixed(2)}
                        </div>
                      </div>
                    </li>
                  );
                })}

                <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex justify-between font-medium">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </li>
              </ul>

              {/* Addresses + checkout */}
              {/* ↓ margin-top ridotta (da mt-4 a mt-3) per togliere lo "spazio morto" */}
              {!addresses || addresses.length === 0 ? (
                <div className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-500/10 p-5 text-amber-100">
                  You need at least one shipping address to complete checkout.
                  <Link className="underline ml-1" href="/profile">
                    Add it in your profile
                  </Link>
                  .
                </div>
              ) : (
                <form
                  action="/api/cart/checkout"
                  method="post"
                  className="mt-3 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <input type="hidden" name="type" value="sample" />
                  {/* Select + dettaglio indirizzo (caret custom) */}
                  <ShippingAddressPicker
                    addresses={addresses as any}
                    defaultId={defaultAddressId}
                  />
                  <button
                    className="h-11 w-full rounded-xl font-semibold text-[#0f1720]"
                    style={{ background: "#E33955" }}
                  >
                    Checkout
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </main>

      {/* GLOBAL FOOTER */}
      <SiteFooter />
    </div>
  );
}
