export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";

/* ---------- Helpers ---------- */
type SP = {
  q?: string;
  type?: string;
  region?: string;
  winery?: string;
  sort?: "name" | "price_low" | "price_high" | "recent";
  page?: string;
};

const PAGE_SIZE = 24;

async function getCatalog(searchParams: SP) {
  const supa = createSupabaseServer();

  // base query + count for pagination
  let q = supa
    .from("vw_catalog")
    .select("*", { count: "exact" })
    .order("wine_name", { ascending: true });

  // filters
  if (searchParams.q) q = q.ilike("wine_name", `%${searchParams.q}%`);
  if (searchParams.type) q = q.eq("type", searchParams.type);
  if (searchParams.region) q = q.eq("region", searchParams.region);
  if (searchParams.winery) q = q.ilike("winery_name", `%${searchParams.winery}%`);

  // sorting
  switch (searchParams.sort) {
    case "price_low":
      q = q.order("price_sample", { ascending: true, nullsFirst: true });
      break;
    case "price_high":
      q = q.order("price_sample", { ascending: false, nullsFirst: true });
      break;
    case "recent":
      q = q.order("created_at", { ascending: false });
      break;
    default:
      q = q.order("wine_name", { ascending: true });
  }

  // pagination
  const page = Math.max(1, Number(searchParams.page || 1));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  q = q.range(from, to);

  const { data, error, count } = await q;
  if (error) throw error;

  return {
    items: (data || []) as any[],
    total: count ?? 0,
    page,
    pages: Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE)),
  };
}

/* ---------- Page ---------- */
export default async function Catalog({
  searchParams,
}: {
  searchParams: SP;
}) {
  const { items, total, page, pages } = await getCatalog(searchParams);

  const q = searchParams.q ?? "";
  const type = searchParams.type ?? "";
  const region = searchParams.region ?? "";
  const winery = searchParams.winery ?? "";
  const sort = searchParams.sort ?? "name";

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
          <Link className="text-white/80 hover:text-white" href="/cart/samples">
            Sample Cart
          </Link>
          <Link className="text-white/80 hover:text-white" href="/profile">
            Profile
          </Link>
        </nav>
      </header>

      <main className="px-5">
        <div className="mx-auto max-w-6xl py-6">
          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/60">
                Catalog
              </div>
              <h1 className="text-3xl font-extrabold text-white">
                Explore wines & add samples
              </h1>
              <p className="text-white/70 text-sm">
                {total.toLocaleString()} items available
              </p>
            </div>
            <Link
              href="/cart/samples"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
            >
              Go to sample cart <ArrowRight size={16} />
            </Link>
          </div>

          {/* Filters */}
          <form
            className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            method="get"
          >
            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-3">
              {/* Search */}
              <label className="grid gap-1">
                <span className="text-[11px] text-white/60">Search</span>
                <div className="flex items-center gap-2 rounded-xl bg-black/30 border border-white/10 px-3 py-3">
                  <Search size={16} className="text-white/50" />
                  <input
                    name="q"
                    defaultValue={q}
                    placeholder="Wine, grape, or keyword"
                    className="bg-transparent outline-none w-full text-white placeholder:text-white/40"
                  />
                </div>
              </label>

              {/* Type */}
              <label className="grid gap-1">
                <span className="text-[11px] text-white/60">Type</span>
                <input
                  name="type"
                  defaultValue={type}
                  placeholder="Red / White / Rosé…"
                  className="rounded-xl bg-black/30 border border-white/10 px-3 py-3 text-white placeholder:text-white/40"
                />
              </label>

              {/* Region */}
              <label className="grid gap-1">
                <span className="text-[11px] text-white/60">Region</span>
                <input
                  name="region"
                  defaultValue={region}
                  placeholder="Tuscany, Veneto…"
                  className="rounded-xl bg-black/30 border border-white/10 px-3 py-3 text-white placeholder:text-white/40"
                />
              </label>

              {/* Winery */}
              <label className="grid gap-1">
                <span className="text-[11px] text-white/60">Winery</span>
                <input
                  name="winery"
                  defaultValue={winery}
                  placeholder="Winery name"
                  className="rounded-xl bg-black/30 border border-white/10 px-3 py-3 text-white placeholder:text-white/40"
                />
              </label>
            </div>

            {/* Row 2: sort + actions */}
            <div className="mt-3 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-2 text-white/70 text-sm">
                  <SlidersHorizontal size={14} /> Sort
                </span>
                <select
                  name="sort"
                  defaultValue={sort}
                  className="rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-white"
                >
                  <option value="name">Name (A–Z)</option>
                  <option value="price_low">Sample price (low → high)</option>
                  <option value="price_high">Sample price (high → low)</option>
                  <option value="recent">Recently added</option>
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-[#0f1720]"
                  style={{ background: "#E33955" }}
                >
                  Apply filters
                </button>
                <Link
                  href="/catalog"
                  className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
                >
                  Reset
                </Link>
              </div>
            </div>
          </form>

          {/* Grid */}
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((w: any) => (
              <li
                key={w.wine_id}
                className="rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition overflow-hidden"
              >
                {/* image */}
                <div className="aspect-square bg-black/30 grid place-items-center overflow-hidden">
                  {w.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={w.image_url}
                      alt={w.wine_name || "Wine"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-white/30 text-xs">No image</div>
                  )}
                </div>

                {/* body */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">
                        {w.wine_name}{" "}
                        {w.vintage ? (
                          <span className="text-white/60">({w.vintage})</span>
                        ) : null}
                      </div>
                      <div className="text-sm text-white/70 truncate">
                        {w.winery_name} · {w.region} · {w.type}
                      </div>
                    </div>
                  </div>

                  <div className="text-sm mt-2 text-white">
                    <span className="text-white/70">Ex-cellar:</span>{" "}
                    €{Number(w.price_ex_cellar ?? 0).toFixed(2)}{" "}
                    <span className="mx-2 text-white/30">•</span>
                    <span className="text-white/70">Sample:</span>{" "}
                    €{Number(w.price_sample ?? 0).toFixed(2)}
                  </div>

                  {/* add sample */}
                  <form
                    action="/api/cart/add"
                    method="post"
                    className="mt-3 flex items-center gap-2"
                  >
                    <input type="hidden" name="wineId" value={w.wine_id} />
                    <input type="hidden" name="listType" value="sample" />
                    <input
                      className="w-20 rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white"
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
              </li>
            ))}
          </ul>

          {/* Empty state */}
          {items.length === 0 && (
            <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.04] p-6 text-center text-white/70">
              No wines found with current filters.
            </div>
          )}

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
                const params = new URLSearchParams({
                  ...Object.fromEntries(Object.entries(searchParams).map(([k, v]) => [k, String(v ?? "")])),
                  page: String(p),
                });
                return (
                  <Link
                    key={p}
                    href={`/catalog?${params.toString()}`}
                    className={`min-w-[2.25rem] h-9 grid place-items-center rounded-lg border ${
                      p === page
                        ? "border-white/20 bg-white/10 text-white"
                        : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]"
                    } text-sm`}
                  >
                    {p}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}
