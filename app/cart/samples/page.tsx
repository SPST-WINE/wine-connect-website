export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

type CartItemRow = {
  id: string;
  quantity: number;
  unit_price: number | null;
  wines: {
    id: string;
    name: string;
    vintage: number | null;
    type: string | null;
    wineries: { name: string | null } | null;
    image_url: string | null;
  } | null;
};

export default async function SampleCartPage() {
  const supa = createSupabaseServer();

  // Who's logged in?
  const { data: { user } } = await supa.auth.getUser();
  if (!user) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-10">
        <h1 className="text-2xl font-semibold">Sample cart</h1>
        <p className="mt-2 text-sm text-neutral-500">
          You are not signed in. <Link className="underline" href="/login">Sign in</Link>.
        </p>
      </main>
    );
  }

  // Resolve buyer
  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!buyer) {
    return (
      <main className="mx-auto max-w-[1100px] px-5 py-10">
        <h1 className="text-2xl font-semibold">Sample cart</h1>
        <p className="mt-2 text-sm text-neutral-500">Buyer profile not found.</p>
      </main>
    );
  }

  // Get open sample cart (do NOT create here)
  const { data: cart } = await supa
    .from("carts")
    .select("id,status,cart_type")
    .eq("buyer_id", buyer.id)
    .eq("status", "open")
    .eq("cart_type", "sample")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let items: CartItemRow[] = [];
  if (cart) {
    const { data } = await supa
      .from("cart_items")
      .select(`
        id, quantity, unit_price,
        wines:wine_id (
          id, name, vintage, type, image_url,
          wineries:wineries ( name )
        )
      `)
      .eq("cart_id", cart.id)
      .order("created_at", { ascending: true }) as unknown as { data: CartItemRow[] | null };
    items = data ?? [];
  }

  const count = items.reduce((n, r) => n + r.quantity, 0);
  const subtotal = items.reduce((s, r) => s + r.quantity * Number(r.unit_price ?? 0), 0);

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-10">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-400">Sample Cart</div>
          <h1 className="text-2xl font-semibold">Your cart</h1>
          <div className="text-sm text-neutral-500">
            {count} {count === 1 ? "item" : "items"} • Total €{subtotal.toFixed(2)}
          </div>
        </div>
        <nav className="text-sm">
          <Link className="underline text-neutral-500 hover:text-neutral-700" href="/catalog">Catalog</Link>
          <span className="mx-2 text-neutral-400">·</span>
          <Link className="underline text-neutral-500 hover:text-neutral-700" href="/profile">Profile</Link>
        </nav>
      </div>

      {/* Empty state */}
      {(!cart || items.length === 0) && (
        <>
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center">
            Your sample cart is empty.{" "}
            <Link className="underline" href="/catalog">Go to catalog</Link>.
          </div>
          <SummaryBox subtotal={subtotal} canCheckout={false} />
        </>
      )}

      {/* Items */}
      {cart && items.length > 0 && (
        <>
          <ul className="mt-6 space-y-3">
            {items.map((it) => {
              const w = it.wines;
              const winery = w?.wineries?.name ?? "—";
              return (
                <li key={it.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="grid grid-cols-[64px_1fr_auto] gap-4 items-center">
                    <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-black/20">
                      {w?.image_url ? (
                        <Image
                          src={w.image_url}
                          alt={w?.name ?? "Wine"}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full grid place-items-center text-xs text-neutral-400">
                          No img
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="font-medium truncate">
                        {w?.name ?? "Unnamed wine"}{" "}
                        {w?.vintage ? <span className="text-neutral-500">({w.vintage})</span> : null}
                      </div>
                      <div className="text-sm text-neutral-500 truncate">
                        {winery} {w?.type ? `· ${w.type}` : ""}
                      </div>
                      <div className="text-sm mt-1">€{Number(it.unit_price ?? 0).toFixed(2)} / sample</div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Update quantity */}
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
                          className="w-20 rounded border bg-transparent p-2"
                        />
                        <button className="rounded bg-black px-3 py-2 text-white text-sm">
                          Update
                        </button>
                      </form>

                      {/* Remove */}
                      <form action="/api/cart/item/remove" method="post">
                        <input type="hidden" name="itemId" value={it.id} />
                        <button className="rounded border px-3 py-2 text-sm hover:bg-white/5">
                          Remove
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <SummaryBox subtotal={subtotal} canCheckout>
            <form action="/api/cart/checkout" method="post">
              <input type="hidden" name="type" value="sample" />
              <button className="h-11 w-full rounded-xl bg-[color:#E33955] font-semibold text-black hover:-translate-y-[1px] transition">
                Request shipment
              </button>
            </form>
          </SummaryBox>
        </>
      )}
    </main>
  );
}

function SummaryBox({
  subtotal,
  canCheckout,
  children,
}: {
  subtotal: number;
  canCheckout: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div className="flex items-center justify-between">
        <div className="text-sm text-neutral-500">Subtotal</div>
        <div className="font-semibold">€{subtotal.toFixed(2)}</div>
      </div>
      {canCheckout && <div className="mt-4">{children}</div>}
    </div>
  );
}
