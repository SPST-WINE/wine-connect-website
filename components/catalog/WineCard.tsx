// components/catalog/WineCard.tsx
import Link from "next/link";
import AddSampleForm from "@/components/wines/AddSampleForm";

export type CatalogItem = {
  wine_id: string;
  wine_name: string | null;
  winery_name: string | null;
  vintage: string | null;
  region: string | null;
  type: string | null;
  price_ex_cellar: number | null;
  price_sample: number | null;
  image_url: string | null;
};

export default function WineCard({ item }: { item: CatalogItem }) {
  const w = item;
  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] transition overflow-hidden">
      {/* IMAGE (click -> dettaglio) */}
      <Link href={`/wines/${w.wine_id}`} className="block">
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
      </Link>

      {/* BODY */}
      <div className="p-4">
        <div className="min-w-0">
          {/* TITOLO (click -> dettaglio) */}
          <Link
            href={`/wines/${w.wine_id}`}
            className="font-semibold text-white truncate hover:underline"
          >
            {w.wine_name} {w.vintage ? <span className="text-white/60">({w.vintage})</span> : null}
          </Link>
          <div className="text-sm text-white/70 truncate">
            {w.winery_name} · {w.region} · {w.type}
          </div>
        </div>

        <div className="text-sm mt-2 text-white">
          <span className="text-white/70">Ex-cellar:</span>{" "}
          €{Number(w.price_ex_cellar ?? 0).toFixed(2)}{" "}
          <span className="mx-2 text-white/30">•</span>
          <span className="text-white/70">Sample:</span>{" "}
          €{Number(w.price_sample ?? 0).toFixed(2)}
        </div>

        {/* Add sample */}
        <AddSampleForm wineId={w.wine_id} className="mt-3" />
      </div>
    </li>
  );
}
