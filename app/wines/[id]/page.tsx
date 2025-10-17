export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

type Wine = {
  id: string;
  winery_id: string | null;
  name: string | null;
  vintage: string | null;
  type: string | null;
  grape_varieties: string[] | null; // array nel DB
  alcohol: number | null;
  bottle_size_ml: number | null;
  certifications: string[] | null;  // array nel DB
  price_ex_cellar: number | null;
  price_sample: number | null;
  description: string | null;
  image_url: string | null;
  available: boolean | null;
};

type Winery = {
  id: string;
  name: string | null;
  region: string | null;
  country: string | null;
};

function fmtMoney(n?: number | null) {
  const v = Number(n ?? 0);
  return v.toFixed(2);
}

function joinArr(a?: string[] | null) {
  if (!a || a.length === 0) return "—";
  return a.filter(Boolean).join(", ");
}

function mlToText(n?: number | null) {
  if (!n) return "—";
  return `${n} ml`;
}

export default async function WineDetail({
  params,
}: {
  params: { id: string };
}) {
  const supa = createSupabaseServer();

  // 1) Vino
  const { data: wine, error: wErr } = await supa
    .from("wines")
    .select(
      "id,winery_id,name,vintage,type,grape_varieties,alcohol,bottle_size_ml,certifications,price_ex_cellar,price_sample,description,image_url,available"
    )
    .eq("id", params.id)
    .maybeSingle<Wine>();

  if (wErr || !wine) {
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

  // 2) Cantina (se presente)
  let winery: Winery | null = null;
  if (wine.winery_id) {
    const { data: wn } = await supa
      .from("wineries")
      .select("id,name,region,country")
      .eq("id", wine.winery_id)
      .maybeSingle<Winery>();
    winery = wn ?? null;
  }

  // Derivati per UI
  const title = `${wine.name ?? "Wine"}${
    wine.vintage ? ` (${wine.vintage})` : ""
  }`;
  const wineryName = winery?.name ?? "—";
  const wineryRegionCountry = [winery?.region, winery?.country]
    .filter(Boolean)
    .join(" — ") || "—";

  const grapeVariety = joinArr(wine.grape_varieties);
  const certs = joinArr(wine.certifications);

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
                {wineryName} · {wineryRegionCountry} · {wine.type ?? "—"}
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

          {/* HERO: immagine a sinistra, colonna destra con Winery + Buy sample */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-[420px,1fr] gap-4 items-stretch">
            {/* LEFT: image (square 1:1) */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mx-auto w-full aspect-square rounded-xl bg-black/30 grid place-items-center overflow-hidden">
                {wine.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={wine.image_url}
                    alt={wine.name ?? "Wine"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <div className="text-white/40 text-sm">No image</div>
                )}
              </div>
            </section>

            {/* RIGHT column: stessa altezza della sinistra grazie a flex-1 nella seconda card */}
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
                  {winery?.id ? (
                    <Link href={`/wineries/${winery.id}`} className="group">
                      <div className="font-semibold text-white group-hover:underline">
                        {wineryName}
                      </div>
                      <div className="text-sm text-white/70">
                        {wineryRegionCountry}
                      </div>
                    </Link>
                  ) : (
                    <div>
                      <div className="font-semibold text-white">{wineryName}</div>
                      <div className="text-sm text-white/70">
                        {wineryRegionCountry}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Buy sample — prende lo spazio rimanente per allinearsi al fondo dell’immagine */}
              <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 flex-1 flex">
                <div className="w-full">
                  <div className="text-[11px] uppercase tracking-wider text-white/60">
                    Buy sample
                  </div>

                  {/* Unica riga, stessa altezza (h-12) per tutti i blocchi */}
                  <div className="mt-3 flex items-stretch gap-3">
                    {/* Ex-cellar */}
                    <div className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 h-12 flex flex-col justify-center">
                      <div className="text-[11px] text-white/60 leading-none">
                        Ex-cellar
                      </div>
                      <div className="text-white font-semibold leading-tight">
                        € {fmtMoney(wine.price_ex_cellar)}
                      </div>
                    </div>
                    {/* Sample */}
                    <div className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 h-12 flex flex-col justify-center">
                      <div className="text-[11px] text-white/60 leading-none">
                        Sample
                      </div>
                      <div className="text-white font-semibold leading-tight">
                        € {fmtMoney(wine.price_sample)}
                      </div>
                    </div>

                    {/* Qty + Add */}
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
                        required
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

          {/* DETAILS */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Technical */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[11px] uppercase tracking-wider text-white/60">
                Wine details
              </div>
              <dl className="mt-3 grid grid-cols-1 gap-1 text-sm">
                <Detail label="Type" value={wine.type} />
                <Detail label="Vintage" value={wine.vintage} />
                <Detail label="Region" value={wineryRegionCountry} />
                <Detail label="Grape variety" value={grapeVariety} />
                <Detail
                  label="Alcohol"
                  value={
                    wine.alcohol != null ? String(Number(wine.alcohol)) : null
                  }
                  suffix="%"
                />
                <Detail label="Bottle size" value={mlToText(wine.bottle_size_ml)} />
                <Detail label="Certifications" value={certs} />
              </dl>
            </section>

            {/* Description */}
            <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="text-[11px] uppercase tracking-wider text-white/60">
                Description
              </div>
              <p className="mt-3 text-white/85 text-sm leading-relaxed">
                {wine.description && wine.description.trim() !== ""
                  ? wine.description
                  : "—"}
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
      <dd className="font-medium">
        {suffix && show !== "—" ? `${show} ${suffix}` : show}
      </dd>
    </div>
  );
}
