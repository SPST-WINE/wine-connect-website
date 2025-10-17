// app/wines/[id]/page.tsx
export const dynamic = "force-dynamic";

import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";
import { ArrowLeft, ShoppingBasket } from "lucide-react";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";
const WC_PINK = "#E33955";

/** Tipi “elastici” per evitare errori in build se alcune colonne non esistono */
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
  created_at: string | null;
};

type WineRow = {
  id: string;
  name: string | null;
  winery_id?: string | null;
  winery_name?: string | null;
  vintage?: string | null;
  region?: string | null;
  type?: string | null;
  image_url?: string | null;
  description?: string | null;
  certifications?: any; // array<string> o json
};

type WineryRow = {
  id: string;
  name?: string | null;
  region?: string | null;
  country?: string | null;
  image_url?: string | null; // hero/cover
  logo_url?: string | null;  // eventuale logo
};

export default async function WineDetail({ params }: { params: { id: string } }) {
  const supa = createSupabaseServer();

  // gated area (coerente con il resto)
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

  // 1) Fonte primaria: RPC su vw_catalog (SECURITY DEFINER)
  let cat: CatalogRow | null = null;
  {
    const { data, error } = await supa
      .rpc("get_catalog_wine", { _wine_id: wineId })
      .maybeSingle<CatalogRow>();
    if (!error) cat = data ?? null;
  }

  // 2) Arricchimento da tabella "wines" (descrizione, certifications, winery_id… se disponibili)
  let baseWine: WineRow | null = null;
  {
    const { data } = await supa
      .from("wines")
      .select("id,name,winery_id,winery_name,vintage,region,type,image_url,description,certifications")
      .eq("id", wineId)
      .maybeSingle<WineRow>();
    baseWine = data ?? null;
  }

  // 3) Dettagli cantina (se abbiamo winery_id)
  let winery: WineryRow | null = null;
  if (baseWine?.winery_id) {
    const { data } = await supa
      .from("wineries")
      .select("id,name,region,country,image_url,logo_url")
      .eq("id", baseWine.winery_id)
      .maybeSingle<WineryRow>();
    winery = data ?? null;
  }

  if (!cat && !baseWine) {
    return (
      <div className="min-h-screen grid place-items-center text-white" style={{ background: BG }}>
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-4 text-center">
          Wine not found. <a className="underline" href="/catalog">Back to catalog</a>
        </div>
      </div>
    );
  }

  // Modello unico per la UI
  const model = {
    id: wineId,
    name: (cat?.wine_name ?? baseWine?.name) || "Wine",
    wineryName:
      (cat?.winery_name ?? baseWine?.winery_name ?? winery?.name) || "",
    vintage: (cat?.vintage ?? baseWine?.vintage) || "",
    region:
      (cat?.region ??
        baseWine?.region ??
        [winery?.region, winery?.country].filter(Boolean).join(" — ")) || "",
    type: (cat?.type ?? baseWine?.type) || "",
    img: (cat?.image_url ?? baseWine?.image_url) || null,
    priceEx: cat?.price_ex_cellar ?? null,
    priceSample: cat?.price_sample ?? null,
    description: baseWine?.description || "",
    certifications: normalizeCerts(baseWine?.certifications),
    createdAt: cat?.created_at ?? null,
    wineryImage: winery?.image_url || winery?.logo_url || null,
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

      <main className="flex-1 px-5">
        <div className="mx-auto max-w-5xl py-8 space-y-6">
          {/* Title */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-wider text-white/60">
                  Catalog
                </div>
                <h1 className="mt-1 text-3xl md:text-4xl font-extrabold text-white">
                  {model.name}
                  {model.vintage ? (
                    <span className="text-white/70"> ({model.vintage})</span>
                  ) : null}
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  {model.wineryName ? `${model.wineryName} · ` : ""}
                  {model.region || ""}
                  {model.type ? ` · ${model.type}` : ""}
                </p>
              </div>
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white hover:bg-black/50 shrink-0"
              >
                <ArrowLeft size={16} /> Back to catalog
              </Link>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* IMAGE */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 flex items-center justify-center">
                {model.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={model.img}
                    alt={model.name}
                    className="max-h-[520px] w-auto object-contain"
                  />
                ) : (
                  <div className="w-full h-[420px] grid place-items-center text-white/50">
                    No image
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-4">
                {/* BUY SAMPLE: prices + qty + button */}
                <form
                  action="/api/cart/add"
                  method="post"
                  className="rounded-2xl border border-white/10 bg-black/30 p-4 space-y-4"
                >
                  <input type="hidden" name="listType" value="sample" />
                  <input type="hidden" name="wineId" value={model.id} />

                  <div>
                    <div className="text-xs uppercase tracking-wider text-white/60">
                      Buy sample
                    </div>
                    <div className="mt-2 text-white/90 grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-white/60 text-xs">Ex-cellar</div>
                        <div className="font-semibold">
                          € {Number(model.priceEx ?? 0).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-white/60 text-xs">Sample</div>
                        <div className="font-semibold">
                          € {Number(model.priceSample ?? 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="text-sm text-white/80 min-w-[72px]">
                      Quantity
                    </label>
                    <input
                      type="number"
                      name="qty"
                      min={1}
                      defaultValue={1}
                      className="w-24 rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-white"
                    />
                    <button
                      className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-[#0f1720]"
                      style={{ background: WC_PINK }}
                    >
                      <ShoppingBasket size={16} /> Add sample
                    </button>
                  </div>
                </form>

                {/* WINERY CARD */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs uppercase tracking-wider text-white/60">
                    Winery
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-14 w-14 rounded-lg overflow-hidden border border-white/10 bg-white/5 grid place-items-center shrink-0">
                      {model.wineryImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={model.wineryImage}
                          alt={model.wineryName || "Winery"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-[10px] text-white/50">No image</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-white truncate">
                        {model.wineryName || "—"}
                      </div>
                      <div className="text-sm text-white/70">
                        {model.region || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* WINE DETAILS: type + description + certifications */}
                <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                  <div className="text-xs uppercase tracking-wider text-white/60">
                    Wine details
                  </div>

                  <div className="mt-2 text-sm text-white/90 space-y-2">
                    <div>
                      <span className="text-white/60">Type:</span>{" "}
                      {model.type || "—"}
                    </div>

                    <div>
                      <span className="text-white/60">Description:</span>
                      <p className="mt-1 whitespace-pre-wrap">
                        {model.description?.trim() || "—"}
                      </p>
                    </div>

                    <div>
                      <span className="text-white/60">Certifications:</span>
                      {model.certifications.length === 0 ? (
                        <span className="ml-1">—</span>
                      ) : (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {model.certifications.map((c: string, i: number) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-full text-xs border border-emerald-400/30 text-emerald-200/90 bg-emerald-500/10"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
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

/** Normalizza certificazioni in array<string> */
function normalizeCerts(raw: any): string[] {
  if (!raw) return [];
  try {
    if (Array.isArray(raw)) return raw.map(String).filter(Boolean);
    if (typeof raw === "string") {
      try {
        const j = JSON.parse(raw);
        if (Array.isArray(j)) return j.map(String).filter(Boolean);
      } catch {
        return raw.split(",").map(s => s.trim()).filter(Boolean);
      }
    }
    if (typeof raw === "object") {
      // es. { organic:true, biodynamic:false } -> ["organic"]
      return Object.entries(raw)
        .filter(([, v]) => Boolean(v))
        .map(([k]) => String(k));
    }
    return [];
  } catch {
    return [];
  }
}
