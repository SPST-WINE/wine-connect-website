// app/wines/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ArrowLeft, ShoppingBasket } from "lucide-react";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";
const WC_PINK = "#E33955";

type CatalogRow = {
  wine_id: string;
  wine_name: string | null;
  winery_name: string | null;
  vintage: string | null;
  region: string | null;
  type: string | null;
  certifications?: string | null;
  price_ex_cellar: number | null;
  price_sample: number | null;
  image_url: string | null;
  created_at?: string | null;
};

export default async function WineDetail({ params }: { params: { id: string } }) {
  const supa = createSupabaseServer();

  // Auth (stesso comportamento del catalogo: se non loggato -> login)
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

  // Dati vino dalla vista "vw_catalog" (no RLS restrittive, contiene image + prezzi)
  const { data: rows } = await supa
    .from("vw_catalog")
    .select("wine_id,wine_name,winery_name,vintage,region,type,price_ex_cellar,price_sample,image_url,created_at")
    .eq("wine_id", params.id)
    .limit(1);

  const wine = (rows?.[0] as CatalogRow | undefined) || null;

  if (!wine) {
    return (
      <div className="min-h-screen grid place-items-center text-white" style={{ background: BG }}>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
          Wine not found. <a className="underline" href="/catalog">Back to catalog</a>
        </div>
      </div>
    );
  }

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
                  {wine.wine_name || "Wine"}
                  {wine.vintage ? <span className="text-white/70"> ({wine.vintage})</span> : null}
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  {wine.winery_name ? `${wine.winery_name} · ` : ""}
                  {wine.region || ""}
                  {wine.type ? ` · ${wine.type}` : ""}
                </p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white hover:bg-black/50 shrink-0"
              >
                <ArrowLeft size={16} /> Back to catalog
              </Link>
            </div>

            {/* Content */}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Image */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center justify-center">
                {wine.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={wine.image_url}
                    alt={wine.wine_name || "Wine"}
                    className="max-h-[520px] w-auto object-contain"
                  />
                ) : (
                  <div className="w-full h-[420px] grid place-items-center text-white/50">No image</div>
                )}
              </div>

              {/* Info + Add sample */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs uppercase tracking-wider text-white/60">Prices</div>
                  <div className="mt-2 text-white/90 space-y-1">
                    <div>Ex-cellar: <span className="font-semibold">€ {(Number(wine.price_ex_cellar || 0)).toFixed(2)}</span></div>
                    <div>Sample: <span className="font-semibold">€ {(Number(wine.price_sample || 0)).toFixed(2)}</span></div>
                  </div>
                </div>

                <form
                  action="/api/cart/add"
                  method="post"
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-3"
                >
                  <input type="hidden" name="list_type" value="sample" />
                  {/* mandiamo entrambi i nomi per compatibilità */}
                  <input type="hidden" name="wineId" value={wine.wine_id} />
                  <input type="hidden" name="wine_id" value={wine.wine_id} />

                  <label className="block text-sm text-white/80">Quantity</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      name="qty"
                      min={1}
                      defaultValue={1}
                      className="w-24 rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white"
                    />
                    {/* per compatibilità se l'API legge "quantity" */}
                    <input type="hidden" name="quantity" value={1} />
                    <button
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-[#0f1720]"
                      style={{ background: WC_PINK }}
                    >
                      <ShoppingBasket size={16} /> Add sample
                    </button>
                  </div>
                  <p className="text-xs text-white/60">
                    Adding a sample puts this wine into your sample cart.
                  </p>
                </form>

                {/* Meta (se vuoi aggiungere altre info, future-proof) */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs uppercase tracking-wider text-white/60">Details</div>
                  <ul className="mt-2 text-sm text-white/90 space-y-1">
                    <li><span className="text-white/60">Winery:</span> {wine.winery_name || "—"}</li>
                    <li><span className="text-white/60">Region:</span> {wine.region || "—"}</li>
                    <li><span className="text-white/60">Type:</span> {wine.type || "—"}</li>
                    <li><span className="text-white/60">Catalog since:</span> {wine.created_at ? new Date(wine.created_at).toLocaleDateString() : "—"}</li>
                  </ul>
                </div>
              </div>
            </div>
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
