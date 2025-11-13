"use client";

import { useState } from "react";
import Image from "next/image";
import { LanguageProvider } from "@/components/site/LanguageProvider";
import { homepageGradient } from "@/lib/theme";

type Step = "landing" | "lead" | "catalog" | "cart" | "success";
type BuyerType = "importer" | "no_import_license";

type Winery = {
  id: string;
  name: string;
  region: string;
  focus: string;
};

type CartItem = {
  wineryId: string;
  wineryName: string;
  sampleSize: 6 | 12;
};

const WINERIES: Winery[] = [
  {
    id: "aurilia",
    name: "Cantina Aurilia",
    region: "Campania",
    focus: "Elegant Aglianico-based reds with volcanic character.",
  },
  {
    id: "poggio-rosso",
    name: "Poggio Rosso",
    region: "Tuscany",
    focus: "Sangiovese and coastal blends with a contemporary style.",
  },
  {
    id: "venti-colline",
    name: "Venti Colline",
    region: "Veneto",
    focus: "Sparkling and still whites for by-the-glass programs.",
  },
];

type HeaderProps = {
  step: Step;
  cartCount: number;
  totalBottles: number;
  onCartClick: () => void;
};

function KoreaHeader({ step, cartCount, totalBottles, onCartClick }: HeaderProps) {
  const showCartButton = step === "catalog" || step === "cart";

  return (
    <header className="mb-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {/* LOGO WINE CONNECT */}
        <div className="relative h-8 w-8 md:h-9 md:w-9">
          <Image
            src="public/wc-logo.png" // <-- CAMBIA QUESTO PERCORSO SE SERVE
            alt="Wine Connect"
            fill
            className="rounded-full object-contain"
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

      {showCartButton && (
        <button
          type="button"
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

function HowItWorksBox() {
  const steps = [
    {
      number: 1,
      title: "Enter Wine Connect",
      text: "Tell us who you are and share your work email.",
    },
    {
      number: 2,
      title: "Explore the wineries",
      text: "Browse the producers attending the Korea event in Seoul.",
    },
    {
      number: 3,
      title: "Build your tasting box",
      text: "Add 6 or 12-bottle samples from the wineries you’re interested in.",
    },
    {
      number: 4,
      title: "Send your request",
      text: "We’ll follow up with details, logistics and compliance support.",
    },
  ];

  return (
    <div className="mt-6 rounded-3xl bg-slate-900/70 p-4 shadow-lg shadow-black/40">
      <p className="mb-3 text-sm font-semibold text-slate-100">How it works</p>
      <div className="space-y-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="flex items-start gap-3 rounded-2xl bg-slate-900/80 px-3 py-2"
          >
            <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-xs font-bold text-slate-950">
              {step.number}
            </div>
            <div className="text-xs text-slate-300">
              <p className="font-semibold text-slate-100">{step.title}</p>
              <p>{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function KoreaEventPage() {
  const [step, setStep] = useState<Step>("landing");

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [buyerType, setBuyerType] = useState<BuyerType>("importer");

  const [leadId, setLeadId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalBottles = cart.reduce((sum, item) => sum + item.sampleSize, 0);

  function addToCart(winery: Winery, size: 6 | 12) {
    setCart((prev) => [
      ...prev,
      { wineryId: winery.id, wineryName: winery.name, sampleSize: size },
    ]);
  }

  async function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/korea/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, companyName, buyerType }),
      });

      if (!res.ok) throw new Error("Unable to save your data. Please try again.");

      const data = await res.json();
      setLeadId(data.leadId);
      setStep("catalog");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCartSubmit(intent: "check_out_later" | "know_more") {
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

      if (!res.ok) throw new Error("Unable to submit your request. Please try again.");

      setStep("success");
    } catch (err: any) {
      setError(err.message ?? "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <LanguageProvider defaultLang="en">
      <main
        className="min-h-screen font-sans text-slate-100 selection:bg-[color:var(--wc)]/30"
        style={{ background: homepageGradient() }}
      >
        <div className="mx-auto flex min-h-screen max-w-md flex-col px-4 py-6 md:max-w-2xl">
          <KoreaHeader
            step={step}
            cartCount={cart.length}
            totalBottles={totalBottles}
            onCartClick={() => setStep("cart")}
          />

          <main className="flex flex-1 flex-col">
            {/* STEP 1 – LANDING */}
            {step === "landing" && (
              <section className="flex flex-1 flex-col justify-between">
                <div>
                  <h1 className="mb-3 text-3xl font-semibold leading-tight">
                    Italian wineries, <br />
                    one tasting box{" "}
                    <span className="text-pink-400">in Korea</span>.
                  </h1>
                  <p className="mb-2 text-sm text-slate-300">
                    Discover a curated selection of Italian producers attending
                    the Wine Connect event in Seoul. Build your own 6 or 12-bottle
                    tasting box and we’ll take care of logistics and compliance.
                  </p>

                  <HowItWorksBox />
                </div>

                <button
                  onClick={() => setStep("lead")}
                  className="mt-8 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 py-3 text-center text-sm font-semibold text-slate-950 shadow-lg shadow-pink-500/25"
                >
                  Enter Wine Connect
                </button>
              </section>
            )}

            {/* STEP 2 – LEAD FORM */}
            {step === "lead" && (
              <section className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="mb-2 text-2xl font-semibold">
                    Tell us who you are
                  </h2>
                  <p className="mb-6 text-sm text-slate-300">
                    We’ll use these details to prepare your personalized access
                    to Wine Connect.
                  </p>

                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-200">
                        Work email
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-pink-500"
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
                        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-pink-500"
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
                          className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-xs ${
                            buyerType === "importer"
                              ? "border-pink-500 bg-pink-500/10"
                              : "border-slate-700 bg-slate-900"
                          }`}
                        >
                          <span className="mt-0.5 h-2 w-2 rounded-full bg-pink-400" />
                          <span>
                            <span className="block font-semibold text-slate-100">
                              I’m an importer – I have an import license
                            </span>
                            <span className="text-slate-300">
                              You already manage wine imports and have all the
                              legal requirements.
                            </span>
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setBuyerType("no_import_license")}
                          className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-left text-xs ${
                            buyerType === "no_import_license"
                              ? "border-pink-500 bg-pink-500/10"
                              : "border-slate-700 bg-slate-900"
                          }`}
                        >
                          <span className="mt-0.5 h-2 w-2 rounded-full bg-orange-400" />
                          <span>
                            <span className="block font-semibold text-slate-100">
                              I’m a buyer without an import license
                            </span>
                            <span className="text-slate-300">
                              You select wines (for horeca, retail, etc.) and
                              work with local importers.
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
                      className="mt-4 w-full rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 py-3 text-center text-sm font-semibold text-slate-950 disabled:opacity-60"
                    >
                      {isSubmitting ? "Saving..." : "Continue to wineries"}
                    </button>
                  </form>
                </div>

                <button
                  type="button"
                  onClick={() => setStep("landing")}
                  className="mt-4 text-center text-xs text-slate-400 underline"
                >
                  Back
                </button>
              </section>
            )}

            {/* STEP 3 – CATALOGO */}
            {step === "catalog" && (
              <section className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="mb-2 text-2xl font-semibold">
                    Wineries at Wine Connect Korea
                  </h2>
                  <p className="mb-4 text-sm text-slate-300">
                    Tap on a winery to add a 6 or 12-bottle sample to your
                    tasting box.
                  </p>

                  <div className="space-y-3">
                    {WINERIES.map((winery) => (
                      <div
                        key={winery.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4"
                      >
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-slate-50">
                              {winery.name}
                            </p>
                            <p className="text-xs text-slate-400">
                              {winery.region}
                            </p>
                          </div>
                        </div>
                        <p className="mb-3 text-xs text-slate-300">
                          {winery.focus}
                        </p>
                        <div className="flex gap-2 text-xs">
                          <button
                            type="button"
                            onClick={() => addToCart(winery, 6)}
                            className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 font-medium text-slate-100"
                          >
                            + 6-bottle sample
                          </button>
                          <button
                            type="button"
                            onClick={() => addToCart(winery, 12)}
                            className="flex-1 rounded-xl bg-pink-500/90 px-3 py-2 font-medium text-slate-950"
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
                    onClick={() => setStep("cart")}
                    className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 py-3 text-center text-sm font-semibold text-slate-950"
                  >
                    Review tasting box
                    {cart.length > 0 &&
                      ` · ${cart.length} wineries · ${totalBottles} bottles`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("lead")}
                    className="w-full rounded-2xl border border-slate-700 py-2 text-center text-xs text-slate-300"
                  >
                    Back
                  </button>
                </div>
              </section>
            )}

            {/* STEP 4 – CARRELLO */}
            {step === "cart" && (
              <section className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="mb-2 text-2xl font-semibold">
                    Your tasting box
                  </h2>
                  <p className="mb-4 text-sm text-slate-300">
                    This is your draft selection. We’ll contact you to confirm
                    details, logistics and compliance, and final pricing after
                    the event.
                  </p>

                  {cart.length === 0 ? (
                    <p className="rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-3 text-xs text-slate-300">
                      Your tasting box is empty. Go back and add at least one
                      winery.
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
                            <p className="text-slate-300">
                              {item.sampleSize} bottles
                            </p>
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
                    onClick={() => handleCartSubmit("check_out_later")}
                    className="w-full rounded-2xl bg-slate-900 py-3 text-center text-sm font-semibold text-slate-100 ring-1 ring-slate-700 disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "Check out later"}
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => handleCartSubmit("know_more")}
                    className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-orange-400 py-3 text-center text-sm font-semibold text-slate-950 disabled:opacity-60"
                  >
                    {isSubmitting ? "Sending..." : "I want to know more"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("catalog")}
                    className="w-full rounded-2xl py-2 text-center text-xs text-slate-400"
                  >
                    Back to wineries
                  </button>
                </div>
              </section>
            )}

            {/* STEP 5 – SUCCESS */}
            {step === "success" && (
              <section className="flex flex-1 flex-col justify-between">
                <div>
                  <h2 className="mb-2 text-2xl font-semibold">
                    Request received
                  </h2>
                  <p className="mb-4 text-sm text-slate-300">
                    Thanks for building your tasting box for Wine Connect Korea.
                  </p>
                  <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-xs text-slate-300">
                    <p>
                      Our team will review your selection and send you an
                      authentication email with your Wine Connect access.
                    </p>
                    <p>In that email you’ll find:</p>
                    <ul className="list-inside list-disc space-y-1">
                      <li>Your temporary password (you can change it anytime).</li>
                      <li>A summary of your tasting box.</li>
                      <li>Next steps to confirm orders after the event.</li>
                    </ul>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep("landing");
                    setCart([]);
                    setLeadId(null);
                    setEmail("");
                    setCompanyName("");
                    setError(null);
                    setIsSubmitting(false);
                  }}
                  className="mt-6 w-full rounded-2xl border border-slate-700 py-2 text-center text-xs text-slate-300"
                >
                  Back to start
                </button>
              </section>
            )}
          </main>
        </div>
      </main>
    </LanguageProvider>
  );
}
