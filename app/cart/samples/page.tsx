export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function SamplesCart() {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)",
        }}
      >
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
          <div className="mx-auto max-w-6xl py-10">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white/80">
              You must <a className="underline" href="/login">sign in</a>.
            </div>
          </div>
        </main>

        <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
          © {new Date().getFullYear()} Wine Connect — SPST
        </footer>
      </div>
    );
  }

  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();
  if (!buyer) {
    return (
      <div
        className="min-h-screen"
        style={{
          background:
            "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)",
        }}
      >
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
          <div className="mx-auto max-w-6xl py-10">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white/80">
              Buyer profile not found.
            </div>
          </div>
        </main>

        <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
          © {new Date().getFullYear()} Wine Connect — SPST
        </footer>
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

  // items (with wine image)
  const { data: items } = cartId
    ? await supa
        .from("cart_items")
        .select(`
          id,
          quantity,
          unit_price,
          list_type,
          wines (
            id,
            name,
            vintage,
            image_url
          )
        `)
        .eq("cart_id", cartId)
    : { data: [] as any[] };

  // addresses
  const { data: addresses } = await supa
    .from("addresses")
    .select("id,label,address,country,is_default")
    .eq("buyer_id", buyer.id)
    .order("is_default", { ascending: false });

  const subtotal = (items || []).reduce(
    (s: number, i: any) => s + i.quantity * Number(i.unit_price),
    0
  );

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
              <h1 className="text-3xl font-extrabold text-white">Your cart</h1>
              <p className="text-white/70 text-sm">
                {(items?.length || 0)} items · Total €
                {subtotal.toFixed(2)}
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
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
                  const img = it.wines?.image_url || null;
                  const title =
                    it.wines?.name +
                    (it.wines?.vintage ? ` (${it.wines.vintage})` : "");
                  const lineTotal = Number(it.unit_price) * it.quantity;

                  return (
                    <li
                      key={it.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex items-center gap-3"
                    >
                      {/* Thumb 1:1 */}
                      <div className="w-16 h-16 rounded-lg border border-white/10 overflow-hidden shrink-0 bg-black/30">
                        {img ? (
                          <img
                            src={img}
                            alt={it.wines?.name || "Wine"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-[11px] text-white/40">
                            No image
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 text-white">
                        <div className="font-semibold truncate">{title}</div>
                        <div className="text-sm text-white/70">
                          €{Number(it.unit_price).toFixed(2)} each
                        </div>
                      </div>

                      {/* Actions */}
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
                            className="w-16 rounded-lg bg-black/30 border border-white/10 px-2 py-1 text-right text-white"
                          />
                          <button className="px-3 py-1.5 rounded-lg bg-black text-white text-sm hover:-translate-y-[1px] transition">
                            Update
                          </button>
                        </form>

                        <form action="/api/cart/item/remove" method="post">
                          <input type="hidden" name="itemId" value={it.id} />
                          <button className="px-3 py-1.5 rounded-lg border border-white/10 text-sm text-white hover:bg-white/5">
                            Remove
                          </button>
                        </form>

                        <div className="w-24 text-right font-medium text-white">
                          €{lineTotal.toFixed(2)}
                        </div>
                      </div>
                    </li>
                  );
                })}

                {/* Subtotal */}
                <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex justify-between font-medium text-white">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </li>
              </ul>

              {/* Addresses + checkout */}
              {!addresses || addresses.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-500/10 p-5 text-amber-100">
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
                  className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                >
                  <input type="hidden" name="type" value="sample" />
                  <label className="block text-sm text-white/80">
                    Shipping address
                  </label>
                  <select
                    name="addressId"
                    required
                    defaultValue={addresses[0]?.id}
                    className="w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white"
                  >
                    {(addresses || []).map((a: any) => (
                      <option key={a.id} value={a.id} className="bg-[#0a1722]">
                        {(a.label || a.address)} ({a.country})
                        {a.is_default ? " • default" : ""}
                      </option>
                    ))}
                  </select>
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

      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}
