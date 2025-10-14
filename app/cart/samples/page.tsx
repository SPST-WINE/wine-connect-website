import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function SamplesCart() {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          You must <a className="underline" href="/login">sign in</a>.
        </div>
      </main>
    );
  }

  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();
  if (!buyer) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          Buyer profile not found.
        </div>
      </main>
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
    <main className="mx-auto max-w-[1100px] px-5 py-10">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-400">Sample cart</div>
          <h1 className="text-2xl font-semibold">Your cart</h1>
        </div>
        <Link href="/catalog" className="text-sm underline text-neutral-400 hover:text-neutral-200">
          Continue browsing
        </Link>
      </div>

      {/* Empty state */}
      {!cartId || !items || items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-sm text-neutral-300">Your cart is empty.</p>
          <p className="mt-1 text-sm text-neutral-400">
            <Link className="underline" href="/catalog">
              Go to catalog
            </Link>{" "}
            to add samples.
          </p>
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
                  <div className="w-16 h-16 rounded-lg border border-white/10 overflow-hidden shrink-0 bg-black/20">
                    {img ? (
                      <img
                        src={img}
                        alt={it.wines?.name || "Wine"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-[11px] text-neutral-400">
                        no img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{title}</div>
                    <div className="text-sm text-neutral-400">
                      €{Number(it.unit_price).toFixed(2)} each
                    </div>
                  </div>

                  {/* Actions: qty + remove + line total */}
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
                        className="w-16 rounded-md border border-white/10 bg-transparent p-1 text-right"
                      />
                      <button className="px-3 py-1.5 rounded-md bg-black text-white text-sm hover:-translate-y-[1px] transition">
                        Update
                      </button>
                    </form>

                    <form action="/api/cart/item/remove" method="post">
                      <input type="hidden" name="itemId" value={it.id} />
                      <button className="px-3 py-1.5 rounded-md border border-white/10 text-sm hover:bg-white/5">
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

            {/* Subtotal */}
            <li className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 flex justify-between font-medium">
              <span>Subtotal</span>
              <span>€{subtotal.toFixed(2)}</span>
            </li>
          </ul>

          {/* Addresses + checkout */}
          {!addresses || addresses.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-500/10 p-5">
              <p className="text-sm text-amber-100">
                You need at least one shipping address to complete checkout.
                <Link className="underline ml-1" href="/profile">
                  Add it now in your profile
                </Link>
                .
              </p>
            </div>
          ) : (
            <form action="/api/cart/checkout" method="post" className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <input type="hidden" name="type" value="sample" />
              <label className="block text-sm text-neutral-300">Shipping address</label>
              <select
                name="addressId"
                className="w-full rounded-md border border-white/10 bg-transparent p-2"
                required
                defaultValue={addresses[0]?.id}
              >
                {(addresses || []).map((a: any) => (
                  <option value={a.id} key={a.id} className="bg-[#0a1722]">
                    {(a.label || a.address)} ({a.country})
                    {a.is_default ? " • default" : ""}
                  </option>
                ))}
              </select>
              <button className="h-11 w-full rounded-xl bg-[color:#E33955] font-semibold text-black hover:-translate-y-[1px] transition">
                Checkout
              </button>
            </form>
          )}
        </>
      )}
    </main>
  );
}
