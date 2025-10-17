export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";

const WC_BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

export default async function WineDetail({ params }: { params: { id: string } }) {
  const supa = createSupabaseServer();

  // === Fetch Wine Details ===
  const { data: wine } = await supa
    .from("vw_wine_details")
    .select("*")
    .eq("id", params.id)
    .maybeSingle();

  if (!wine) {
    return (
      <div
        className="min-h-screen flex items-center justify-center text-white"
        style={{ background: WC_BG }}
      >
        <div className="rounded-xl border border-white/10 bg-white/[0.05] p-6">
          Wine not found.
        </div>
      </div>
    );
  }

  // === Recommended Wines (stesso tipo e regione) ===
  const { data: recommended } = await supa
    .from("vw_wine_details")
    .select("id, name, vintage, type, price_sample, wine_image_url, winery_name, winery_region")
    .neq("id", wine.id)
    .eq("type", wine.type)
    .limit(3);

  return (
    <div className="min-h-screen" style={{ background: WC_BG }}>
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-5">
        <Link href="/catalog" className="flex items-center gap-2 text-white">
          <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
          <span className="font-semibold">Wine Connect</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link className="text-white/80 hover:text-white" href="/cart/samples">
            Sample Cart
          </Link>
          <Link className="text-white/80 hover:text-white" href="/orders">
            Orders
          </Link>
        </nav>
      </header>

      {/* Body */}
      <main className="px-5">
        <div className="mx-auto max-w-6xl py-8 space-y-8">
          {/* Back button */}
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm"
          >
            <ArrowLeft size={14} /> Back to catalog
          </Link>

          {/* === TOP SECTION === */}
          <div className="grid grid-cols-1 md:grid-cols-[380px_1fr] gap-6 items-start">
            {/* Wine Image */}
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

            {/* RIGHT COLUMN */}
            <div className="flex flex-col gap-4">
              {/* Winery Card */}
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

              {/* Buy Sample Card */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
                <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
                  Buy Sample
                </div>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                  <div>
                    <div className="text-white text-sm">
                      <span className="text-white/60">Ex-cellar:</span>{" "}
                      €{Number(wine.price_ex_cellar ?? 0).toFixed(2)}
                    </div>
                    <div className="text-white text-sm">
                      <span className="text-white/60">Sample:</span>{" "}
                      €{Number(wine.price_sample ?? 0).toFixed(2)}
                    </div>
                    <div className="text-white/70 text-xs mt-1">
                      MOQ: {wine.moq || 0} bottles
                    </div>
                  </div>

                  <form
                    action="/api/cart/add"
                    method="post"
                    className="flex items-center gap-2"
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
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* === DETAILS SECTION === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Details */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
              <h2 className="text-lg font-semibold text-white mb-3">
                Technical Details
              </h2>
              <ul className="space-y-1 text-sm text-white/80">
                <li>
                  <strong className="text-white">Type:</strong> {wine.type}
                </li>
                <li>
                  <strong className="text-white">Vintage:</strong> {wine.vintage}
                </li>
                <li>
                  <strong className="text-white">Grape variety:</strong>{" "}
                  {wine.grape_variety}
                </li>
                <li>
                  <strong className="text-white">Alcohol:</strong>{" "}
                  {wine.alcohol_percent}%
                </li>
                <li>
                  <strong className="text-white">Bottle size:</strong>{" "}
                  {wine.bottle_size}
                </li>
                <li>
                  <strong className="text-white">Certifications:</strong>{" "}
                  {wine.certifications || "—"}
                </li>
              </ul>
            </div>

            {/* Description */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
              <h2 className="text-lg font-semibold text-white mb-3">
                Description
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                {wine.description || "No description available."}
              </p>
            </div>
          </div>

          {/* === RECOMMENDED WINES === */}
          {recommended && recommended.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-3">
                Recommended Wines
              </h2>
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
                          src={r.wine_image_url}
                          alt={r.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 text-white">
                        <div className="font-semibold truncate">{r.name}</div>
                        <div className="text-sm text-white/70 truncate">
                          {r.winery_name} · {r.winery_region}
                        </div>
                        <div className="text-sm text-white mt-1">
                          €{Number(r.price_sample ?? 0).toFixed(2)} sample
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
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
