// app/wineries/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import WineCard from "@/components/cards/WineCard";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

type Winery = {
  id: string;
  name: string | null;
  region: string | null;
  country: string | null;
  description: string | null;
  website: string | null;
  logo_url: string | null;
};

type Wine = {
  id: string;
  name: string | null;
  vintage: string | null;
  type: string | null;
  price_sample: number | null;
  price_ex_cellar: number | null;
  alcohol: number | null;
  image_url: string | null;
  available: boolean | null;
};

export default async function WineryDetail({
  params,
}: {
  params: { id: string };
}) {
  const supa = createSupabaseServer();

  // 1) Cantina
  const { data: winery } = await supa
    .from("wineries")
    .select(
      "id,name,region,country,description,website,logo_url"
    )
    .eq("id", params.id)
    .maybeSingle<Winery>();

  if (!winery) {
    return (
      <div className="min-h-screen flex flex-col text-white" style={{ background: BG }}>
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

  // 2) Vini della cantina
  const { data: wines } = await supa
    .from("wines")
    .select(
      "id,name,vintage,type,price_sample,price_ex_cellar,alcohol,image_url,available"
    )
    .eq("winery_id", winery.id)
    .order("name", { ascending: true });

  const regionCountry =
    [winery.region, winery.country].filter(Boolean).join(" — ") || "—";

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: BG }}>
      {/* Header globale */}
      <SiteHeader />

      <main className="flex-1 px-5">
        <div className="mx-auto max-w-6xl py-6 space-y-6">
          {/* Testata cantina */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4 min-w-0">
                <div className="h-12 w-12 rounded-lg border border-white/10 bg-black/30 overflow-hidden grid place-items-center shrink-0">
                  {winery.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={winery.logo_url}
                      alt={winery.name ?? "Winery"}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-[10px] text-white/50">No image</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-2xl md:text-3xl font-extrabold truncate">
                    {winery.name ?? "Winery"}
                  </h1>
                  <div className="text-white/70 text-sm">{regionCountry}</div>
                  {winery.website ? (
                    <div className="mt-1 text-sm">
                      <a
                        className="underline"
                        href={winery.website}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {winery.website}
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm hover:bg-white/15"
              >
                <ArrowLeft size={16} />
                Back to catalog
              </Link>
            </div>

            {winery.description ? (
              <p className="mt-4 text-white/85 text-sm leading-relaxed">
                {winery.description}
              </p>
            ) : null}
          </section>

          {/* Lista vini */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="text-[11px] uppercase tracking-wider text-white/60">
              Wines from {winery.name ?? "this winery"}
            </div>

            {(wines ?? []).length === 0 ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/80">
                No wines available for this winery yet.
              </div>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {(wines as Wine[]).map((w) => (
                  <li key={w.id}>
                    <WineCard
                      id={w.id}
                      name={w.name}
                      vintage={w.vintage}
                      type={w.type}
                      alcohol={w.alcohol}
                      image_url={w.image_url}
                      priceSample={w.price_sample}
                      priceExCellar={w.price_ex_cellar}
                      available={w.available}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      {/* Footer globale sempre in basso */}
      <SiteFooter />
    </div>
  );
}
