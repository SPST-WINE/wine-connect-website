"use client";

import { useState } from "react";
import { LanguageProvider } from "@/components/site/LanguageProvider";

import KoreaHeader from "@/components/korea/KoreaHeader";
import KoreaLandingStep from "@/components/korea/KoreaLandingStep";
import KoreaLeadStep from "@/components/korea/KoreaLeadStep";
import KoreaCatalogStep from "@/components/korea/KoreaCatalogStep";
import KoreaCartStep from "@/components/korea/KoreaCartStep";
import KoreaSuccessStep from "@/components/korea/KoreaSuccessStep";

import { homepageGradient } from "@/lib/theme";
import {
  KOREA_WINERIES,
  KoreaWinery,
} from "@/components/korea/wineriesKorea";

export type Step = "landing" | "lead" | "catalog" | "cart" | "success";
export type BuyerType = "importer" | "no_import_license";

// alias del tipo cantina
export type Winery = KoreaWinery;

export type CartItem = {
  wineryId: string;
  wineryName: string;
  sampleSize: 6 | 12;
};

// Cantine statiche per l'evento Korea
const WINERIES: Winery[] = KOREA_WINERIES;

export default function KoreaEventPage() {
  const [step, setStep] = useState<Step>("landing");

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [buyerType, setBuyerType] = useState<BuyerType>("importer");

  const [leadId, setLeadId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalBottles = cart.reduce((s, i) => s + i.sampleSize, 0);

  function addToCart(winery: Winery, size: 6 | 12) {
    setCart((c) => [
      ...c,
      {
        wineryId: winery.id,
        wineryName: winery.name,
        sampleSize: size,
      },
    ]);
  }

  return (
    <LanguageProvider defaultLang="en">
      <main
        className="min-h-screen font-sans text-slate-100"
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
            {step === "landing" && (
              <KoreaLandingStep onNext={() => setStep("lead")} />
            )}

            {step === "lead" && (
              <KoreaLeadStep
                email={email}
                setEmail={setEmail}
                companyName={companyName}
                setCompanyName={setCompanyName}
                buyerType={buyerType}
                setBuyerType={setBuyerType}
                error={error}
                isSubmitting={isSubmitting}
                setError={setError}
                setIsSubmitting={setIsSubmitting}
                setLeadId={setLeadId}
                onNext={() => setStep("catalog")}
                onBack={() => setStep("landing")}
              />
            )}

            {step === "catalog" && (
              <KoreaCatalogStep
                wineries={WINERIES}
                addToCart={addToCart}
                cart={cart}
                totalBottles={totalBottles}
                onNext={() => setStep("cart")}
                onBack={() => setStep("lead")}
              />
            )}

            {step === "cart" && (
              <KoreaCartStep
                cart={cart}
                totalBottles={totalBottles}
                error={error}
                isSubmitting={isSubmitting}
                setError={setError}
                setIsSubmitting={setIsSubmitting}
                leadId={leadId}
                onNext={() => setStep("success")}
                onBack={() => setStep("catalog")}
              />
            )}

            {step === "success" && (
              <KoreaSuccessStep
                onRestart={() => {
                  setStep("landing");
                  setCart([]);
                  setEmail("");
                  setCompanyName("");
                  setLeadId(null);
                  setError(null);
                  setIsSubmitting(false);
                }}
              />
            )}
          </main>
        </div>
      </main>
    </LanguageProvider>
  );
}
