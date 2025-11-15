"use client";

import { Dispatch, SetStateAction } from "react";
import { BuyerType } from "@/app/korea/page";

const WC_COLOR = "#E33854";

type Props = {
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  companyName: string;
  setCompanyName: Dispatch<SetStateAction<string>>;

  buyerType: BuyerType;
  setBuyerType: Dispatch<SetStateAction<BuyerType>>;

  error: string | null;
  isSubmitting: boolean;
  setError: Dispatch<SetStateAction<string | null>>;
  setIsSubmitting: Dispatch<SetStateAction<boolean>>;
  setLeadId: Dispatch<SetStateAction<string | null>>;

  onNext: () => void;
  onBack: () => void;
};

export default function KoreaLeadStep({
  email,
  setEmail,
  companyName,
  setCompanyName,
  buyerType,
  setBuyerType,
  error,
  isSubmitting,
  setError,
  setIsSubmitting,
  setLeadId,
  onNext,
  onBack,
}: Props) {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/korea/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, companyName, buyerType }),
      });

      if (!res.ok) {
        throw new Error("Unable to save your data. Please try again.");
      }

      const data = await res.json();
      setLeadId(data.leadId as string);
      onNext();
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const baseBuyerBtn =
    "flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-xs transition-colors";

  const activeBuyer =
    "border-[#E33854] bg-[#E33854]/10 shadow-[0_0_0_1px_rgba(227,56,84,0.4)]";
  const inactiveBuyer = "border-slate-700 bg-slate-900";

  return (
    <section className="flex flex-1 flex-col justify-between">
      <div>
        <h2 className="mb-2 text-2xl font-semibold">Tell us who you are</h2>
        <p className="mb-6 text-sm text-slate-300">
          We’ll use these details to prepare your personalized access to Wine
          Connect.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-200">
              Work email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-[#E33854]"
              placeholder="you@company.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-200">
              Company name
            </label>
            <input
              type="text"
              required
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-[#E33854]"
              placeholder="Your company"
            />
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-slate-200">
              What type of buyer are you?
            </p>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setBuyerType("importer")}
                className={`${baseBuyerBtn} ${
                  buyerType === "importer" ? activeBuyer : inactiveBuyer
                }`}
              >
                <span
                  className="mt-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: WC_COLOR }}
                />
                <span>
                  <span className="block font-semibold text-slate-100">
                    I’m an importer – I have an import license
                  </span>
                  <span className="text-slate-300">
                    You already manage wine imports and have all the legal
                    requirements.
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBuyerType("no_import_license")}
                className={`${baseBuyerBtn} ${
                  buyerType === "no_import_license"
                    ? activeBuyer
                    : inactiveBuyer
                }`}
              >
                <span
                  className="mt-1 h-2 w-2 rounded-full"
                  style={{ backgroundColor: WC_COLOR }}
                />
                <span>
                  <span className="block font-semibold text-slate-100">
                    I’m a buyer without an import license
                  </span>
                  <span className="text-slate-300">
                    You select wines (for horeca, retail, etc.) and work with
                    local importers.
                  </span>
                </span>
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-xs text-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-[#E33854] to-orange-400 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-[rgba(227,56,84,0.35)] disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Continue to wineries"}
          </button>
        </form>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 text-center text-xs text-slate-400 underline"
      >
        Back
      </button>
    </section>
  );
}
