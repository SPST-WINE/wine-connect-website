// app/wines/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ArrowLeft, ShoppingBasket } from "lucide-react";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";
const WC_PINK = "#E33955";

type WineRow = {
  id: string;
  name: string | null;
  winery_name: string | null; // se in schema è diverso, rimane null (ok)
  vintage: string | null;
  region: string | null;
  type: string | null;
  image_url: string | null;
};

type CatalogRow = {
  wine_id: string;
  wine_name: string | null;
  winery_name: string | null;
  vintage: string | null;
  region: string | null;
  type: string | null;
  price_ex_cellar: number | null;
  price_sample: number | null;
  image_url: string | null;
  created_at?: string | null;
};

export default async function WineDetail({ params }: { params: { id: string } }) {
  const supa = createSupabaseServer();

  // richiede login coerente con area privata
  const { data: { user } } = await supa.auth.getUser();
  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center text-white" style={{ background: BG }}>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
          Please <a className="underline" href="/login">sign in</a> to view this wine.
        </div>
      </div>
    );
  }

  const wineId = params.id;

  // 1) Base: prendo SEMPRE la riga da "wines" per garantire il dettaglio
  const { data: baseWine } = await supa
    .from("wines")
    .select("id,name,winery_name,vintage,region,type,image_url")
    .eq("id", wineId)
    .maybeSingle<WineRow>();

  if (!baseWine) {
    return (
      <div className="min-h-screen grid place-items-center text-white" style={{ background: BG }}>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-center">
          Wine not found. <a className="underline" href="/catalog">Back to catalog</a>
        </div>
      </div>
    );
  }

  // 2) Extra: prezzi/immagine consolidata dalla vista (se disponibile)
  let cat: CatalogRow | null = null;
  {
    const { data } = await supa
      .from("vw_catalog")
      .select("wine_id,wine_name,winery_name,vintage,region,type,price_ex_cellar,price_sample,image_url,created_at")
      .eq("wine_id", wineId)
      .maybeSingle<CatalogRow>();
    cat = data ?? null;
  }

  // 3) Merge dei dati (fallback su wines, override con vw_catalog se presenti)
  const model = {
    id: wineId,
    name: cat?.wine_name ?? baseWine.name ?? "Wine",
    winery: cat?.winery_name ?? baseWine.winery_name ?? "",
    vintage: cat?.vintage ?? baseWine.vintage ?? "",
    region: cat?.region ?? baseWine.region ?? "",
    type: cat?.type ?? baseWine.type ?? "",
    img: (cat?.image_url ?? baseWine.image_url) || null,
    priceEx: cat?.price_ex_cellar ?? null,
    priceSample: cat?.price_sample ?? null,
    createdAt: cat?.created_at ?? null,
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: BG }}>
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-5">
        <Link href="/buyer-home" className="flex items-center gap-2 text-white">
          <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
          <span className="font-semibold">Wine Connect</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link className="text-white/80 hover:text-white" href="/catalog">Catalog</Link>
          <Link className="text-white/80 hover:text-white" href="/cart/samples">Sample Cart</Link>
          <Link className="text-white/80 hover:text-white" href="/profile">Profile</Link>
        </nav>
      </header>

      {/* Body */}
      <main className="flex-1 px-5">
        <div className="mx-auto max-w-5xl py-8 space-y-6">
          {/* Hero */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-white/60">Catalog</div>
                <h1 className="mt-1 text-3xl md:text-4xl font-extrabold text-white">
                  {model.name}{model.vintage ? <span className="text-white/70"> ({model.vintage})</span> : null}
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  {model.winery ? `${model.winery} · ` : ""}{model.region || ""}{model.type ? ` · ${model.type}` : ""}
                </p>
              </div>
              <Link href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white hover:bg-black/50 shrink-0">
                <ArrowLeft size={16} /> Back to catalog
              </Link>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Image */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center justify-center">
                {model.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={model.img} alt={model.name} className="max-h-[520px] w-auto object-contain" />
                ) : (
                  <div className="w-full h-[420px] grid place-items-center text-white/50">No image</div>
                )}
              </div>

              {/* Info + Add sample */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs uppercase tracking-wider text-white/60">Prices</div>
                  <div className="mt-2 text-white/90 space-y-1">
                    <div>Ex-cellar: <span className="font-semibold">€ {Number(model.priceEx ?? 0).toFixed(2)}</span></div>
                    <div>Sample: <span className="font-semibold">€ {Number(model.priceSample ?? 0).toFixed(2)}</span></div>
                  </div>
                </div>

                {/* Add sample form */}
                <form action="/api/cart/add" method="post" className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3">
                  <input type="hidden" name="listType" value="sample" />
                  <input type="hidden" name="wineId" value={model.id} />
                  <label className="block text-sm text-white/80">Quantity</label>
                  <div className="flex items-center gap-3">
                    <input type="number" name="qty" min={1} defaultValue={1}
                      className="w-24 rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white" />
                    <button className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-[#0f1720]"
                      style={{ background: WC_PINK }}>
                      <ShoppingBasket size={16} /> Add sample
                    </button>
                  </div>
                  <p className="text-xs text-white/60">Adding a sample puts this wine into your sample cart.</p>
                </form>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs uppercase tracking-wider text-white/60">Details</div>
                  <ul className="mt-2 text-sm text-white/90 space-y-1">
                    <li><span className="text-white/60">Winery:</span> {model.winery || "—"}</li>
                    <li><span className="text-white/60">Region:</span> {model.region || "—"}</li>
                    <li><span className="text-white/60">Type:</span> {model.type || "—"}</li>
                    <li><span className="text-white/60">Catalog since:</span> {model.createdAt ? new Date(model.createdAt).toLocaleDateString() : "—"}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}
