"use client";

import { Dispatch, SetStateAction } from "react";
import { CartItem } from "@/app/korea/page";

type Props = {
  cart: CartItem[];
  totalBottles: number;
  error: string | null;
  isSubmitting: boolean;
  setError: Dispatch<SetStateAction<string | null>>;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  leadId: string | null;
  onNext: () => void;
  onBack: () => void;
};

export default function KoreaCartStep({
  cart,
  totalBottles,
  error,
  isSubmitting,
  setError,
  setIsSubmitting,
  leadId,
  onNext,
  onBack,
}: Props) {
  async function handleSubmit(intent: "check_out_later" | "know_more") {
    if (!leadId) {
      setError("Missing lead data. Please go back and re-enter your details.");
      return;
    }
    if (cart.length === 0) {
      setError("Your tasting box is empty. Please add at least one winery.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/korea/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, intent, items: cart }),
      });

      if (!res.ok) {
        throw new Error("Unable to submit your request. Please try again.");
      }

      onNext();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex flex-1 flex-col justify-between">
      <div>
        <h2 className="mb-2 text-2xl font-semibold">Your tasting box</h2>
        <p className="mb-4 text-sm text-slate-300">
          This is your draft selection. We’ll contact you to confirm details,
          logistics and compliance, and final pricing after the event.
        </p>

        {cart.length === 0 ? (
          <p className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-3 text-xs text-slate-300">
            Your tasting box is empty. Go back and add at least one winery.
          </p>
        ) : (
          <div className="mb-4 space-y-2">
            {cart.map((item, idx) => (
              <div
                key={`${item.wineryId}-${idx}`}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-100">
                    {item.wineryName}
                  </p>
                  <p className="text-slate-300">{item.sampleSize} bottles</p>
                </div>
              </div>
            ))}
            <p className="mt-2 text-xs text-slate-400">
              Total:{" "}
              <span className="font-semibold text-slate-100">
                {totalBottles}
              </span>{" "}
              bottles
            </p>
          </div>
        )}

        {error && (
          <p className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-100">
            {error}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit("check_out_later")}
          className="w-full rounded-2xl bg-slate-900 py-3 text-center text-sm font-semibold text-slate-100 ring-1 ring-slate-700 disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "Check out later"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => handleSubmit("know_more")}
          className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 py-3 text-center text-sm font-semibold text-slate-950 disabled:opacity-60"
        >
          {isSubmitting ? "Sending..." : "I want to know more"}
        </button>
        <button
          type="button"
          onClick={onBack}
          className="w-full rounded-2xl py-2 text-center text-xs text-slate-400"
        >
          Back to wineries
        </button>
      </div>
    </section>
  );
}
