import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function SamplesCart() {
  const supa = createSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) {
    return (
      <div className="mt-10">
        Devi <a className="underline" href="/login">accedere</a>.
      </div>
    );
  }

  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("auth_user_id", user.id)
    .single();
  if (!buyer) return <div>Profilo buyer non trovato.</div>;

  // carrello aperto
  const { data: carts } = await supa
    .from("carts")
    .select("id")
    .eq("buyer_id", buyer.id)
    .eq("type", "sample")
    .eq("status", "open")
    .limit(1);
  const cartId = carts?.[0]?.id;

  // items con wine.image_url
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

  // indirizzi
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
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Carrello campionature</h1>
        <Link href="/catalog" className="text-sm underline">
          Continua a scegliere
        </Link>
      </div>

      {!cartId || !items || items.length === 0 ? (
        <div className="rounded border bg-white p-4">
          <p className="text-sm">Il carrello è vuoto.</p>
          <p className="text-sm mt-1">
            <Link className="underline" href="/catalog">
              Vai al catalogo
            </Link>{" "}
            per aggiungere dei sample.
          </p>
        </div>
      ) : (
        <>
          <ul className="grid gap-3">
            {(items || []).map((it: any) => {
              const img = it.wines?.image_url || null;
              const title =
                it.wines?.name +
                (it.wines?.vintage ? ` (${it.wines.vintage})` : "");
              const lineTotal = Number(it.unit_price) * it.quantity;

              return (
                <li
                  key={it.id}
                  className="rounded border bg-white p-3 flex items-center gap-3"
                >
                  {/* Thumb 1:1 */}
                  <div className="w-16 h-16 rounded border overflow-hidden shrink-0">
                    {img ? (
                      <img
                        src={img}
                        alt={it.wines?.name || "Wine"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-[11px] text-neutral-500">
                        no img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{title}</div>
                    <div className="text-sm text-neutral-600">
                      €{Number(it.unit_price).toFixed(2)} cad.
                    </div>
                  </div>

                  {/* Azioni: qty + remove */}
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
                        className="w-16 border rounded p-1 text-right"
                      />
                      <button className="px-3 py-1.5 rounded bg-black text-white text-sm">
                        Aggiorna
                      </button>
                    </form>

                    <form action="/api/cart/item/remove" method="post">
                      <input type="hidden" name="itemId" value={it.id} />
                      <button className="px-3 py-1.5 rounded border text-sm">
                        Rimuovi
                      </button>
                    </form>

                    <div className="w-20 text-right font-medium">
                      €{lineTotal.toFixed(2)}
                    </div>
                  </div>
                </li>
              );
            })}

            <li className="rounded border bg-white p-3 flex justify-between font-medium">
              <span>Subtotale</span>
              <span>€{subtotal.toFixed(2)}</span>
            </li>
          </ul>

          {/* Indirizzi + checkout */}
          {!addresses || addresses.length === 0 ? (
            <div className="rounded border bg-amber-50 p-4">
              <p className="text-sm">
                Ti serve almeno un indirizzo di spedizione per completare il
                checkout.
                <Link className="underline ml-1" href="/profile">
                  Aggiungilo ora nella pagina profilo
                </Link>
                .
              </p>
            </div>
          ) : (
            <form action="/api/cart/checkout" method="post" className="space-y-3">
              <input type="hidden" name="type" value="sample" />
              <label className="block text-sm">Indirizzo spedizione</label>
              <select
                name="addressId"
                className="border rounded p-2 w-full"
                required
                defaultValue={addresses[0]?.id}
              >
                {(addresses || []).map((a: any) => (
                  <option value={a.id} key={a.id}>
                    {(a.label || a.address)} ({a.country})
                    {a.is_default ? " • default" : ""}
                  </option>
                ))}
              </select>
              <button className="px-4 py-2 rounded bg-black text-white">
                Checkout
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
