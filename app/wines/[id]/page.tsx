export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";

type WineRow = {
  id: string;
  name: string | null;
  vintage: string | null;
  type: string | null;
  grape_variety: string | null;
  alcohol_percent: string | null;
  bottle_size: string | null;
  certifications: string | null;
  price_ex_cellar: string | null;
  price_sample: string | null;
  description: string | null;
  wine_image_url: string | null;
  winery_id: string | null;
  winery_name: string | null;
  winery_region: string | null;
};

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

export default async function WineDetail({
  params,
}: {
  params: { id: string };
}) {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  // se serve login, mostriamo lo stesso la pagina (solo “Add sample” richiederà login nel submit)
  // fetch wine (usa la vista/materialized o la query server-side già impostata)
  const { data: wine } = await supa
    .from("vw_wine_full") // se non hai creato la view, sostituisci con "wines" + join client come già fatto
    .select(
      `
      id,name,vintage,type,grape_variety,alcohol_percent,bottle_size,certifications,
      price_ex_cellar,price_sample,description,wine_image_url,winery_id,winery_name,winery_region
    `
    )
    .eq("id", params.id)
    .maybeSingle<WineRow>();

  if (!wine) {
    return (
      <div
        className="min-h-screen grid place-items-center text-white/80"
        style={{ background: BG }}
      >
        <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3">
          Wine not found.{" "}
          <a className="underline" href="/catalog">
            Back to catalog
          </a>
          .
        </div>
      </div>
    );
  }

  const title = `${wine.name ?? "Wine"}${
    wine.vintage ? ` (${wine.vintage})` : ""
  }`;
  const exCellar = Number(wine.price_ex_cellar ?? 0).toFixed(2);
  const sample = Number(wine.price_sample ?? 0).toFixed(2);

  return (
    <div className="min-h-screen" style={{ background: BG }}>
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
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/60">
                Catalog
              </div>
              <h1 className="text-3xl font-extrabold text-white">{title}</h1>
              <p className="text-white/70 text-sm">
                {wine.winery_name ?? "—"} · {wine.winery_region ?? "—"} ·{" "}
                {wine.type ?? "—"}
              </p>
            </div>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
            >
              <ArrowLeft size={16} />
              Back to catalog
            </Link>
          </div>

          {/* HERO: image left + right column (winery + buy) */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-[420px,1fr] gap-4 items-stretch">
            {/* LEFT: image card (fixed square) */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mx-auto w-full aspect-square rounded-xl bg-black/30 grid place-items-center overflow-hidden">
                {wine.wine_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={wine.wine_image_url}
                    alt={wine.name ?? "Wine"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="text-white/40 text-sm">No image</div>
                )}
              </div>
            </section>

            {/* RIGHT: same height column; buy card aligned to bottom */}
            <div className="flex flex-col gap-4">
              {/* Winery */}
              <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-[11px] uppercase tracking-wider text-white/60">
                  Winery
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-black/30 grid place-items-center text-[10px] text-white/50">
                    No image
                  </div>
                  {wine.winery_id ? (
                    <Link
                      href={`/wineries/${wine.winery_id}`}
                      className="group"
                    >
                      <div className="font-semibold text-white group-hover:underline">
                        {wine.winery_name ?? "—"}
                      </div>
                      <div className="text-sm text-white/70">
                        {wine.winery_region ?? "—"}
                      </div>
                    </Link>
                  ) : (
                    <div>
                      <div className="font-semibold text-white">
                        {wine.winery_name ?? "—"}
                      </div>
                      <div className="text-sm text-white/70">
                        {wine.winery_region ?? "—"}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Buy sample (grows to align with image card bottom) */}
              <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex-1 flex">
                <div className="w-full">
                  <div className="text-[11px] uppercase tracking-wider text-white/60">
                    Buy sample
                  </div>

                  {/* Single row, same heights */}
                  <div className="mt-3 flex items-stretch gap-3">
                    {/* Ex-cellar box */}
                    <div className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 h-12 flex flex-col justify-center">
                      <div className="text-[11px] text-white/60 leading-none">
                        Ex-cellar
                      </div>
                      <div className="text-white font-semibold leading-tight">
                        € {exCellar}
                      </div>
                    </div>

                    {/* Sample box */}
                    <div className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 h-12 flex flex-col justify-center">
                      <div className="text-[11px] text-white/60 leading-none">
                        Sample
                      </div>
                      <div className="text-white font-semibold leading-tight">
                        € {sample}
                      </div>
                    </div>

                    {/* Qty */}
                    <form
                      action="/api/cart/add"
                      method="post"
                      className="flex items-stretch gap-3"
                    >
                      <input type="hidden" name="wineId" value={wine.id} />
                      <input type="hidden" name="listType" value="sample" />
                      <input
                        name="qty"
                        type="number"
                        min={1}
                        defaultValue={1}
                        className="w-16 h-12 rounded-lg bg-black/30 border border-white/10 px-3 text-white text-center"
                      />
                      <button
                        className="h-12 rounded-lg px-4 font-semibold text-[#0f1720]"
                        style={{ background: "#E33955" }}
                      >
                        Add sample
                      </button>
                    </form>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* DETAILS: full width split in 2 */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[11px] uppercase tracking-wider text-white/60">
                Wine details
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-1 text-sm">
                <Detail label="Type" value={wine.type} />
                <Detail label="Vintage" value={wine.vintage} />
                <Detail label="Region" value={wine.winery_region} />
                <Detail label="Grape variety" value={wine.grape_variety} />
                <Detail label="Alcohol" value={wine.alcohol_percent} suffix="%" />
                <Detail label="Bottle size" value={wine.bottle_size} />
                <Detail label="Certifications" value={wine.certifications} />
              </dl>
            </section>

            {/* Description */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[11px] uppercase tracking-wider text-white/60">
                Description
              </div>
              <p className="mt-3 text-white/85 text-sm leading-relaxed">
                {wine.description || "—"}
              </p>
            </section>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}

function Detail({
  label,
  value,
  suffix,
}: {
  label: string;
  value?: string | null;
  suffix?: string;
}) {
  const show =
    value != null && String(value).trim() !== "" ? String(value) : "—";
  return (
    <div className="flex items-start justify-between gap-3 text-white/85">
      <dt className="text-white/60">{label}:</dt>
      <dd className="font-medium">{suffix && show !== "—" ? `${show} ${suffix}` : show}</dd>
    </div>
  );
}
