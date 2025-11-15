"use client";

import { CartItem, Winery } from "@/app/korea/page";

const WC_COLOR = "#E33854";

type Props = {
  wineries: Winery[];
  cart: CartItem[];
  totalBottles: number;
  addToCart: (w: Winery, size: 6 | 12) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function KoreaCatalogStep({
  wineries,
  cart,
  totalBottles,
  addToCart,
  onNext,
  onBack,
}: Props) {
  return (
    <section className="flex flex-1 flex-col justify-between">
      <div>
        <h2 className="mb-2 text-2xl font-semibold">
          Wineries at Wine Connect Korea
        </h2>
        <p className="mb-4 text-sm text-slate-300">
          Tap on a winery to add a 6 or 12-bottle sample to your tasting box.
        </p>

        <div className="space-y-3">
          {wineries.map((winery) => (
            <div
              key={winery.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
            >
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-50">
                    {winery.name}
                  </p>
                  <p className="text-xs text-slate-400">{winery.region}</p>
                </div>
              </div>

              <p className="mb-1 text-xs text-slate-300">{winery.focus}</p>

              {winery.styles && winery.styles.length > 0 && (
                <p className="mb-3 text-[11px] text-slate-400">
                  {winery.styles.join(" · ")}
                </p>
              )}

              <div className="flex gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => addToCart(winery, 6)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-medium text-slate-100 transition-colors hover:border-[#E33854]"
                >
                  + 6-bottle sample
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(winery, 12)}
                  className="flex-1 rounded-xl px-3 py-2 font-medium text-slate-950"
                  style={{ backgroundColor: WC_COLOR }}
                >
                  + 12-bottle sample
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2">
        <button
          type="button"
          onClick={onNext}
          className="w-full rounded-2xl bg-gradient-to-r from-[#E33854] to-orange-400 py-3 text-center text-sm font-semibold text-slate-950 shadow-[0_10px_25px_rgba(0,0,0,0.45)]"
        >
          Review tasting box
          {cart.length > 0 &&
            ` · ${cart.length} wineries · ${totalBottles} bottles`}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-2xl border border-slate-700 py-2 text-center text-xs text-slate-300"
        >
          Back
        </button>
      </div>
    </section>
  );
}
