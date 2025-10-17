export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

export default async function WineDetail({
  params,
}: {
  params: { id: string };
}) {
  const supa = createSupabaseServer();

  // Dettaglio vino dalla VIEW
  const { data: wine } = await supa
    .from("vw_wine_details")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!wine) {
    return (
      <div
        className="min-h-screen grid place-items-center text-white/80"
        style={{ background: BG }}
      >
        <div className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3">
          Wine not found.
        </div>
      </div>
    );
  }

  // Semplici "consigliati": stesso type, escluso quello attuale
  const { data: recommended } = await supa
    .from("vw_wine_details")
    .select("id, name, vintage, type, price_sample, wine_image_url, winery_name, winery_region")
    .neq("id", wine.id)
    .eq("type", wine.type)
    .limit(3);

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      {/* Topbar */}
      <header className="h-14 flex items-center justify-between px-5">
        <Link href="/catalog" className="flex items-center gap-2 text-white">
          <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
          <span className="font-semibold">Wine Connect</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link className="text-white/80 hover:text-white" href="/cart/samples">
            Sample Cart
          </Link>
          <Link className="text-white/80 hover:text-white" href="/profile">
            Profile
          </Link>
        </nav>
      </header>

      <main className="px-5">
        <div className="mx-auto max-w-6xl py-6 space-y-6">
          {/* Breadcrumb / back */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/60">
                Catalog
              </div>
              <h1 className="text-3xl font-extrabold text-white">
                {wine.name} {wine.vintage ? `(${wine.vintage})` : ""}
              </h1>
              <p className="text-white/70 text-sm">
                {wine.winery_name} · {wine.winery_region || "—"} · {wine.type}
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
            >
              <ArrowLeft size={16} /> Back to catalog
            </Link>
          </div>

          {/* HERO: immagine (sx) + winery/buy (dx) */}
          <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-6 items-start">
            {/* Image */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden">
              <div className="aspect-[3/4] bg-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={wine.wine_image_url}
                  alt={wine.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {/* WINERY */}
              <Link
                href={`/wineries/${wine.winery_id}`}
                className="block rounded-2xl border border-white/10 bg-white/[0.05] p-4 hover:bg-white/[0.08] transition"
              >
                <div className="text-xs uppercase tracking-wider text-white/60">
                  Winery
                </div>
                <div className="mt-1 text-lg font-semibold text-white">
                  {wine.winery_name}
                </div>
                <div className="text-sm text-white/70">{wine.winery_region}</div>
              </Link>

              {/* BUY SAMPLE */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
                  Buy sample
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
                  {/* Prezzi */}
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                    <div className="text-xs text-white/60">Ex-cellar</div>
                    <div className="text-white font-medium">
                      €{Number(wine.price_ex_cellar ?? 0).toFixed(2)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/30 p-3">
                    <div className="text-xs text-white/60">Sample</div>
                    <div className="text-white font-medium">
                      €{Number(wine.price_sample ?? 0).toFixed(2)}
                    </div>
                  </div>

                  {/* Qty + Add */}
                  <form
                    action="/api/cart/add"
                    method="post"
                    className="flex items-center gap-2 justify-end"
                  >
                    <input type="hidden" name="wineId" value={wine.id} />
                    <input type="hidden" name="listType" value="sample" />
                    <input
                      className="w-20 rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white text-right"
                      name="qty"
                      type="number"
                      min={1}
                      defaultValue={1}
                    />
                    <button
                      className="rounded-lg px-3 py-2 text-sm font-semibold text-[#0f1720]"
                      style={{ background: "#E33955" }}
                    >
                      Add sample
                    </button>
                  </form>
                </div>

                <div className="text-white/60 text-xs mt-2">
                  MOQ: {wine.moq || 0} bottles
                </div>
              </div>
            </div>
          </div>

          {/* DETTAGLI + DESCRIZIONE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
              <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
                Wine details
              </div>
              <ul className="space-y-1 text-sm text-white/80">
                <li>
                  <span className="text-white">Type:</span> {wine.type || "—"}
                </li>
                <li>
                  <span className="text-white">Vintage:</span>{" "}
                  {wine.vintage || "—"}
                </li>
                <li>
                  <span className="text-white">Region:</span>{" "}
                  {wine.winery_region || "—"}
                </li>
                <li>
                  <span className="text-white">Grape variety:</span>{" "}
                  {wine.grape_variety || "—"}
                </li>
                <li>
                  <span className="text-white">Alcohol:</span>{" "}
                  {wine.alcohol_percent ? `${wine.alcohol_percent}%` : "—"}
                </li>
                <li>
                  <span className="text-white">Bottle size:</span>{" "}
                  {wine.bottle_size || "—"}
                </li>
                <li>
                  <span className="text-white">Certifications:</span>{" "}
                  {wine.certifications || "—"}
                </li>
              </ul>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
              <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
                Description
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                {wine.description || "—"}
              </p>
            </div>
          </div>

          {/* RECOMMENDED */}
          {recommended && recommended.length > 0 && (
            <section>
              <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
                Recommended
              </div>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.map((r) => (
                  <li
                    key={r.id}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition overflow-hidden"
                  >
                    <Link href={`/wines/${r.id}`}>
                      <div className="aspect-square bg-black/30 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={r.wine_image_url || "/placeholder.png"}
                          alt={r.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 text-white">
                        <div className="font-semibold truncate">
                          {r.name} {r.vintage ? `(${r.vintage})` : ""}
                        </div>
                        <div className="text-sm text-white/70 truncate">
                          {r.winery_name} · {r.winery_region || "—"}
                        </div>
                        <div className="text-sm text-white mt-1">
                          €{Number(r.price_sample ?? 0).toFixed(2)} sample
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}
