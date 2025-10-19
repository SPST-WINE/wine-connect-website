// components/cards/WineCard.tsx
import Link from "next/link";

export type WineCardProps = {
  id: string;
  name?: string | null;
  vintage?: string | null;
  type?: string | null;
  alcohol?: number | null;
  image_url?: string | null;
  priceSample?: number | null;
  priceExCellar?: number | null;
  available?: boolean | null;
  href?: string; // opzionale: default /wines/{id}
};

function money(n?: number | null) {
  const v = Number(n ?? 0);
  return `€ ${v.toFixed(2)}`;
}

export default function WineCard({
  id,
  name,
  vintage,
  type,
  alcohol,
  image_url,
  priceSample,
  priceExCellar,
  available,
  href,
}: WineCardProps) {
  const title = `${name ?? "Wine"}${vintage ? ` (${vintage})` : ""}`;
  const link = href || `/wines/${id}`;

  const pillCls = available
    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
    : "bg-white/10 text-white/70 border-white/20";

  return (
    <Link
      href={link}
      className="group rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition overflow-hidden block"
    >
      {/* Immagine 1:1 */}
      <div className="w-full aspect-square bg-black/30 grid place-items-center overflow-hidden">
        {image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image_url}
            alt={name ?? "Wine"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-[11px] text-white/50">No image</span>
        )}
      </div>

      {/* Contenuto */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold truncate group-hover:underline">
              {title}
            </div>
            <div className="text-xs text-white/70 mt-0.5">
              {type ?? "—"} {alcohol ? `· ${Number(alcohol)}%` : ""}
            </div>
          </div>

          {/* Stato */}
          <span className={`text-[11px] px-2 py-0.5 rounded-full border shrink-0 ${pillCls}`}>
            {available ? "Available" : "Not available"}
          </span>
        </div>

        {/* Prezzi */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm rounded-md border border-white/10 bg-black/30 px-2 py-1">
            Ex-cellar {money(priceExCellar)}
          </span>
          <span className="text-sm rounded-md border border-white/10 bg-black/30 px-2 py-1">
            Sample {money(priceSample)}
          </span>
        </div>
      </div>
    </Link>
  );
}
