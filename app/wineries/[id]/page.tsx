// app/wineries/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

type Winery = {
  id: string;
  name: string | null;
  region: string | null;
  country: string | null;
  description: string | null;
  logo_url: string | null;
  website?: string | null;
};

type Wine = {
  id: string;
  name: string | null;
  vintage: string | null;
  type: string | null;
  price_sample: number | null;
  alcohol: number | null;
  image_url: string | null;
  available: boolean | null;
};

function money(n?: number | null) {
  const v = Number(n ?? 0);
  return `€ ${v.toFixed(2)}`;
}

export default async function WineryPage({ params }: { params: { id: string } }) {
  const supa = createSupabaseServer();

  const { data: winery } = await supa
    .from("wineries")
    .select("id,name,region,country,description,logo_url,website")
    .eq("id", params.id)
    .maybeSingle<Winery>();

  if (!winery) {
    return (
      <div
        className="min-h-screen flex flex-col text-white"
        style={{ background: BG }}
      >
        <SiteHeader />
        <main className="flex-1 grid place-items-center px-5">
          <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            Winery not found.{" "}
            <a className="underline" href="/catalog">
              Back to catalog
            </a>
            .
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const { data: wines } = await supa
    .from("wines")
    .select(
      "id,name,vintage,type,price_sample,alcohol,image_url,available"
    )
    .eq("winery_id", winery.id)
    .order("name", { ascending: true });

  const regionCountry =
    [winery.region, winery.country].filter(Boolean).join(" — ") || "—";

  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{ background: BG }}
    >
      <SiteHeader />

      {/* ⬇️ main flessibile per spingere footer giù */}
      <main className="flex-1 px-5 flex flex-col">
        <div className="mx-auto max-w-6xl py-6 flex-1 flex flex-col space-y-6">
          {/* HEADER CANTINA */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className="h-14 w-14 rounded-xl overflow-hidden bg-black/30 grid place-items-center text-[10px] text-white/50 shrink-0">
                  {winery.logo_url ? (
                    <img
                      src={winery.logo_url}
                      alt={winery.name ?? "Winery"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    "No logo"
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider text-white/60">
                    Winery
                  </div>
                  <h1 className="mt-1 text-3xl md:text-4xl font-extrabold">
                    {winery.name ?? "Winery"}
                  </h1>
                  <p className="mt-1 text-sm text-white/70">{regionCountry}</p>
                  {winery.website && (
                    <p className="mt-1 text-sm">
                      <a
                        className="underline text-white/80 hover:text-white"
                        href={winery.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {winery.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm hover:bg-white/15 shrink-0"
              >
                Back to catalog
              </Link>
            </div>

            <p className="mt-4 text-white/85 text-sm leading-relaxed">
              {winery.description && winery.description.trim() !== ""
                ? winery.description
                : "—"}
            </p>
          </section>

          {/* LISTA VINI */}
          <section className="flex-1">
            <div className="mb-3 text-[11px] uppercase tracking-wider text-white/60">
              Wines from {winery.name ?? "this winery"}
            </div>

            {(wines ?? []).length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-white/70 text-sm">
                No wines available for this winery yet.
              </div>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(wines as Wine[]).map((w) => {
                  const title = `${w.name ?? "Wine"}${
                    w.vintage ? ` (${w.vintage})` : ""
                  }`;
                  return (
                    <li
                      key={w.id}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] overflow-hidden"
                    >
                      <Link href={`/wines/${w.id}`} className="block group">
                        <div className="p-4 flex gap-4">
                          <div className="h-20 w-14 rounded-lg overflow-hidden bg-black/30 shrink-0 grid place-items-center">
                            {w.image_url ? (
                              <img
                                src={w.image_url}
                                alt={w.name ?? "Wine"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-[10px] text-white/50">
                                No image
                              </span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold truncate group-hover:underline">
                              {title}
                            </div>
                            <div className="text-xs text-white/70 mt-0.5">
                              {w.type ?? "—"}{" "}
                              {w.alcohol ? `· ${Number(w.alcohol)}%` : ""}
                            </div>
                            <div className="text-sm mt-2">
                              <span className="rounded-md border border-white/10 bg-black/30 px-2 py-1">
                                Sample {money(w.price_sample)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="px-4 pb-4 text-[11px] text-white/60">
                          {w.available ? "Available" : "Not available"}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>
      </main>

      {/* Footer fisso in fondo */}
      <SiteFooter />
    </div>
  );
}
