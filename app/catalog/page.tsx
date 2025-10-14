import { createSupabaseServer } from "@/lib/supabase/server";
import Link from "next/link";

type SearchParams = {
  q?: string;
  type?: string;
  region?: string;
};

async function getCatalog(searchParams: SearchParams) {
  const supa = createSupabaseServer();
  // Se la view espone i campi già pronti, "*" va benone.
  // Assicurati che in vw_catalog ci sia anche image_url (o wine_image_url).
  let q = supa.from("vw_catalog").select("*").limit(60);

  if (searchParams.q && searchParams.q.trim()) {
    q = q.ilike("wine_name", `%${searchParams.q.trim()}%`);
  }
  if (searchParams.type && searchParams.type.trim()) {
    q = q.eq("type", searchParams.type.trim());
  }
  if (searchParams.region && searchParams.region.trim()) {
    q = q.eq("region", searchParams.region.trim());
  }

  const { data, error } = await q;
  if (error) throw error;
  return data ?? [];
}

export default async function Catalog({ searchParams }: { searchParams: SearchParams }) {
  const items = await getCatalog(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Catalogo</h1>
        <Link className="underline" href="/cart/samples">
          Carrello campionature
        </Link>
      </div>

      {/* Filtri */}
      <form className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          name="q"
          placeholder="Cerca vino..."
          defaultValue={searchParams.q || ""}
          className="border rounded p-2"
        />
        <input
          name="type"
          placeholder="Tipo (Red/White...)"
          defaultValue={searchParams.type || ""}
          className="border rounded p-2"
        />
        <input
          name="region"
          placeholder="Regione"
          defaultValue={searchParams.region || ""}
          className="border rounded p-2"
        />
        <button className="border rounded p-2">Filtra</button>
      </form>

      {/* Griglia vini */}
      <ul className="grid md:grid-cols-3 gap-4">
        {items.map((w: any) => {
          const img: string | null = w.image_url ?? w.wine_image_url ?? null; // fallback
          const priceEx = Number(w.price_ex_cellar ?? 0);
          const priceSample = Number(w.price_sample ?? 0);
          const certs: string[] =
            Array.isArray(w.certifications) ? w.certifications : [];

          return (
            <li key={w.wine_id} className="border rounded-lg bg-white overflow-hidden">
              {/* Immagine */}
              {img ? (
                <img
                  src={img}
                  alt={w.wine_name}
                  className="w-full h-40 object-cover border-b"
                />
              ) : (
                <div className="w-full h-40 grid place-items-center text-xs text-neutral-500 border-b">
                  Nessuna immagine
                </div>
              )}

              <div className="p-4">
                <div className="font-medium">
                  {w.wine_name}{" "}
                  <span className="text-sm text-neutral-500">
                    {w.vintage ? `(${w.vintage})` : ""}
                  </span>
                </div>
                <div className="text-sm text-neutral-600">
                  {w.winery_name} · {w.region} · {w.type}
                </div>

                {/* Certifications (se presenti) */}
                {certs.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {certs.map((c) => (
                      <span
                        key={c}
                        className="text-[11px] px-2 py-0.5 rounded border bg-neutral-50"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                <div className="text-sm mt-2">
                  Ex-cellar: €{priceEx.toFixed(2)}{" "}
                  <span className="text-neutral-400">|</span> Sample: €
                  {priceSample.toFixed(2)}
                </div>

                <form
                  action={`/api/cart/add`}
                  method="post"
                  className="mt-3 flex gap-2"
                >
                  <input type="hidden" name="wineId" value={w.wine_id} />
                  <input type="hidden" name="listType" value="sample" />
                  <input
                    className="border rounded p-2 w-20"
                    name="qty"
                    type="number"
                    min={1}
                    defaultValue={1}
                    inputMode="numeric"
                  />
                  <button className="px-3 py-2 rounded bg-black text-white">
                    Aggiungi sample
                  </button>
                </form>
              </div>
            </li>
          );
        })}
        {items.length === 0 && (
          <li className="col-span-full border rounded-lg p-4 bg-white text-sm text-neutral-600">
            Nessun risultato. Prova a cambiare i filtri.
          </li>
        )}
      </ul>
    </div>
  );
}
