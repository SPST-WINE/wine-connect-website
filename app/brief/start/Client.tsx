// app/brief/start/Client.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-5">
      {children}
    </div>
  );
}

function Progress({ step }: { step: number }) {
  const pct = (step / 3) * 100;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between text-xs text-white/70">
        <span>Step {step} of 3</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-white/10">
        <div
          className="h-2 rounded-full"
          style={{ width: `${pct}%`, background: "#E33955", boxShadow: "0 0 16px rgba(227,57,85,.35)" }}
        />
      </div>
    </div>
  );
}

function Chip({
  checked,
  onClick,
  children,
}: {
  checked?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border text-sm ${
        checked
          ? "bg-white/15 border-white/20 text-white"
          : "bg-white/[0.05] border-white/10 text-white/80 hover:bg-white/[0.08]"
      }`}
    >
      {children}
    </button>
  );
}

function HeroStart({ onStart }: { onStart: () => void }) {
  return (
    <SectionCard>
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">
          Tell us what you're looking for
        </h1>
        <p className="text-white/80">
          Answer a few quick questions — our team will curate a shortlist and ship you a tasting kit.
        </p>
        <p className="text-white/60 text-sm">
          Takes less than 3 minutes. All data is confidential and helps us match you with the right wineries.
        </p>
        <div className="pt-2">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 rounded-xl px-5 py-3 font-semibold text-[#0f1720]"
            style={{ background: "#E33955" }}
          >
            Start the brief →
          </button>
        </div>
      </div>
    </SectionCard>
  );
}

export default function ClientBriefWizard({
  buyerId,
  fullName,
}: {
  buyerId: string | null;
  fullName: string | null;
}) {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // state
  const [wineStyles, setWineStyles] = useState<string[]>([]);
  const [certs, setCerts] = useState<string[]>([]);
  const [audience, setAudience] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [frequency, setFrequency] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [wish, setWish] = useState<string>("");
  const [pref, setPref] = useState<string>("Shortlist only");
  const [file, setFile] = useState<File | null>(null);

  const toggle = (arr: string[], value: string, setter: (v: string[]) => void) =>
    setter(arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]);

  const submit = async () => {
    setErrorMsg(null);
    if (!buyerId) {
      setErrorMsg("You must be signed in to submit a brief.");
      return;
    }

    try {
      setIsSending(true);
      const form = new FormData();
      form.set("buyer_id", buyerId);
      form.set("wine_styles", JSON.stringify(wineStyles));
      form.set("price_range", priceRange);
      form.set("certifications", JSON.stringify(certs));
      form.set("target_audience", JSON.stringify(audience));
      form.set("quantity_estimate", quantity);
      form.set("regions_interest", JSON.stringify(regions));
      form.set("frequency_orders", frequency);
      form.set("brief_notes", `${notes}${wish ? `\n\nWineries: ${wish}` : ""}`);
      form.set("shortlist_preference", pref);
      if (file) form.set("uploaded_file", file);

      const res = await fetch("/api/brief/submit", { method: "POST", body: form });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || "Failed to submit");
      }

      setSubmitted(true); // chiude il form e mostra la conferma
    } catch (e: any) {
      setErrorMsg(e?.message || "Unexpected error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      {!started ? (
        <HeroStart onStart={() => setStarted(true)} />
      ) : submitted ? (
        <SectionCard>
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-extrabold text-white">
              Thank you{fullName ? `, ${fullName}` : ""}!
            </h2>
            <p className="text-white/80">
              Our team is curating your shortlist. You’ll receive your tailored selection within 48 hours.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Link
                href="/buyer-home"
                className="rounded-xl px-4 py-2 font-semibold text-[#0f1720]"
                style={{ background: "#E33955" }}
              >
                Return to Buyer Home
              </Link>
              <Link
                href="/catalog"
                className="rounded-xl border border-white/10 px-4 py-2 text-white/85 hover:bg-white/5"
              >
                Go to Catalog
              </Link>
            </div>
          </div>
        </SectionCard>
      ) : (
        <>
          <Progress step={step} />
          {errorMsg && (
            <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {errorMsg}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <SectionCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold text-lg">Buyer Preferences</h3>
                  <p className="text-white/70 text-sm">Help us understand your style and positioning.</p>
                </div>

                <div className="grid gap-5">
                  <div>
                    <div className="text-white/80 text-sm mb-2">Wine styles</div>
                    <div className="flex flex-wrap gap-2">
                      {["Red", "White", "Rosé", "Sparkling", "Sweet / Fortified"].map((w) => (
                        <Chip key={w} checked={wineStyles.includes(w)} onClick={() => toggle(wineStyles, w, setWineStyles)}>
                          {w}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/80 text-sm mb-2">Price range per bottle (ex-cellar)</div>
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white"
                    >
                      <option value="">Select…</option>
                      {["< €4", "€4–8", "€8–15", "€15–25", "€25+"].map((r) => (
                        <option key={r} value={r} className="bg-[#0a1722]">
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="text-white/80 text-sm mb-2">Certifications / Special interest</div>
                    <div className="flex flex-wrap gap-2">
                      {["Organic / Biodynamic", "Vegan", "DOC / DOCG / IGT", "Natural / Low-intervention"].map((c) => (
                        <Chip key={c} checked={certs.includes(c)} onClick={() => toggle(certs, c, setCerts)}>
                          {c}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/80 text-sm mb-2">Target audience</div>
                    <div className="flex flex-wrap gap-2">
                      {["Restaurants", "Retail / Wine shops", "E-commerce", "Private clients"].map((t) => (
                        <Chip key={t} checked={audience.includes(t)} onClick={() => toggle(audience, t, setAudience)}>
                          {t}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setStep(2)}
                    className="rounded-xl px-4 py-2 font-semibold text-[#0f1720]"
                    style={{ background: "#E33955" }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </SectionCard>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <SectionCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold text-lg">Volume & Regions</h3>
                  <p className="text-white/70 text-sm">Tell us more about formats, regions and cadence.</p>
                </div>

                <div className="grid gap-5">
                  <div>
                    <div className="text-white/80 text-sm mb-2">Estimated quantity / order size</div>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white"
                    >
                      <option value="">Select…</option>
                      {["Samples only", "1–5 pallets / year", "5–20 pallets / year", "20+ pallets / year"].map((q) => (
                        <option key={q} value={q} className="bg-[#0a1722]">
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="text-white/80 text-sm mb-2">Preferred bottle formats</div>
                    <div className="flex flex-wrap gap-2">
                      {["0.75L", "Magnum", "Bag-in-box", "Other"].map((f) => (
                        <Chip key={f} checked={certs.includes(f)} onClick={() => toggle(certs, f, setCerts)}>
                          {f}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/80 text-sm mb-2">Interested regions</div>
                    <div className="flex flex-wrap gap-2">
                      {["Piemonte", "Toscana", "Veneto", "Sicilia", "Puglia", "Friuli", "Altro"].map((r) => (
                        <Chip key={r} checked={regions.includes(r)} onClick={() => toggle(regions, r, setRegions)}>
                          {r}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/80 text-sm mb-2">Frequency of orders</div>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white"
                    >
                      <option value="">Select…</option>
                      {["One-off", "Monthly", "Quarterly", "Twice a year"].map((f) => (
                        <option key={f} value={f} className="bg-[#0a1722]">
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-white/85 hover:bg-white/5"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="rounded-xl px-4 py-2 font-semibold text-[#0f1720]"
                    style={{ background: "#E33955" }}
                  >
                    Next
                  </button>
                </div>
              </div>
            </SectionCard>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <SectionCard>
              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-semibold text-lg">Personalisation</h3>
                  <p className="text-white/70 text-sm">Add final notes and preferences.</p>
                </div>

                <div className="grid gap-5">
                  <div>
                    <div className="text-white/80 text-sm mb-2">Describe your ideal selection</div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={4}
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white"
                      placeholder='e.g. "Elegant Italian reds for fine dining, focus on Barolo and Brunello."'
                    />
                  </div>

                  <div>
                    <div className="text-white/80 text-sm mb-2">
                      Any wineries you already work with or would like to discover?
                    </div>
                    <input
                      value={wish}
                      onChange={(e) => setWish(e.target.value)}
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white"
                      placeholder="Type here…"
                    />
                  </div>

                  <div>
                    <div className="text-white/80 text-sm mb-2">
                      Do you need the samples shipped or prefer a shortlist first?
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {["Shortlist only", "Shortlist + Tasting Kit"].map((p) => (
                        <Chip key={p} checked={pref === p} onClick={() => setPref(p)}>
                          {p}
                        </Chip>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-white/80 text-sm mb-2">
                      Upload your wine list / portfolio (optional)
                    </div>
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      accept=".pdf,.xls,.xlsx,.csv,.doc,.docx,.txt"
                      className="w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white file:mr-3 file:rounded-lg file:border-0 file:bg-white/15 file:px-3 file:py-1 file:text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-white/10 px-4 py-2 text-white/85 hover:bg-white/5"
                  >
                    Back
                  </button>
                  <button
                    onClick={submit}
                    disabled={isSending}
                    className="rounded-xl px-4 py-2 font-semibold text-[#0f1720] disabled:opacity-60"
                    style={{ background: "#E33955" }}
                  >
                    {isSending ? "Submitting…" : "Submit my brief"}
                  </button>
                </div>
              </div>
            </SectionCard>
          )}
        </>
      )}
    </div>
  );
}
