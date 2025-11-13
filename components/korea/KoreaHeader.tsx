import Image from "next/image";
import { Step } from "@/app/korea/page";

export default function KoreaHeader({
  step,
  cartCount,
  totalBottles,
  onCartClick,
}: {
  step: Step;
  cartCount: number;
  totalBottles: number;
  onCartClick: () => void;
}) {
  const showCart = step === "catalog" || step === "cart";

  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* LOGO */}
        <div className="relative h-8 w-8 md:h-9 md:w-9">
          <Image
            src="/wc-logo.png"
            alt="Wine Connect"
            fill
            className="object-contain"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">
            Wine Connect
          </p>
          <p className="text-sm font-medium text-slate-100">
            Korea · 3–4 Dec 2025
          </p>
        </div>
      </div>

      {showCart && (
        <button
          onClick={onCartClick}
          className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-200"
        >
          {cartCount === 0
            ? "Tasting box"
            : `${cartCount} wineries · ${totalBottles} bottles`}
        </button>
      )}
    </header>
  );
}
