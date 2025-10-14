"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

/* ===== PALETTE (same as site) ===== */
const WC_BLUE = "#0a1722";
const WC_BLUE_SOFT = "#1c3e5e";
const WC_PINK = "#E33955";

export default function LoginPage() {
  const r = useRouter();
  const search = useSearchParams();
  const checkEmail = search.get("checkEmail");

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(checkEmail ? "Check your inbox to confirm your email." : null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);
    setLoading(true);
    const supa = supabaseBrowser();

    try {
      if (mode === "login") {
        const { error } = await supa.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // go straight to the buyer hub
        r.push("/buyer-home");
      } else {
        const { error } = await supa.auth.signUp({
          email,
          password,
          options: {
            data: { company_name: "", country: "", name: "" },
            // after the user clicks the magic link, Next route will finalize the session
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setOk("We’ve sent you a confirmation link. Please check your inbox.");
        // keep the user on the page; after confirming they’ll land on /buyer-home
      }
    } catch (e: any) {
      setErr(e?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="min-h-screen font-sans text-slate-100 relative"
      style={{
        ["--wc" as any]: WC_PINK,
        background:
          "radial-gradient(140% 140% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)",
      }}
    >
      {/* glows */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[620px] w-[620px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(60% 60% at 35% 35%, ${WC_PINK}55, transparent 60%)` }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.35, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="pointer-events-none absolute -bottom-24 right-1/2 translate-x-1/2 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{ background: `radial-gradient(60% 60% at 70% 70%, ${WC_BLUE_SOFT}66, transparent 60%)` }}
      />

      {/* header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
        <div className="mx-auto max-w-[1200px] px-5 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2 text-white font-extrabold">
            <img src="/wc-logo.png" alt="Wine Connect" className="h-8 w-auto" />
            <span className="hidden sm:inline">Wine Connect</span>
          </a>
          <nav className="text-sm">
            <a className="hover:underline" href="/">Back to public site</a>
          </nav>
        </div>
      </header>

      {/* card */}
      <section className="mx-auto max-w-[1200px] px-5">
        <div className="mx-auto max-w-md mt-10 sm:mt-16 rounded-2xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="text-xs uppercase tracking-wider text-white/70">Buyer access</div>
          <h1 className="mt-1 text-[28px] sm:text-[32px] font-black leading-[1.05]">
            {mode === "login" ? "Sign in to Wine Connect" : "Create your buyer account"}
          </h1>
          <p className="mt-2 text-white/80 text-sm">
            {mode === "login"
              ? "Use your email and password to access your buyer hub."
              : "Sign up to request tailored shortlists or browse the catalog."}
          </p>

          {/* alerts */}
          {err && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 text-sm p-3">
              {err}
            </div>
          )}
          {ok && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-200 text-sm p-3">
              {ok}
            </div>
          )}

          <form onSubmit={submit} className="mt-5 grid gap-3">
            <label className="group grid gap-1">
              <span className="text-[11px] text-white/60">Email</span>
              <div className="flex items-center gap-2 rounded-xl px-3 py-3 bg-black/30 border border-white/10 ring-0 focus-within:ring-1 focus-within:ring-white/30">
                <Mail size={16} className="opacity-70" />
                <input
                  className="bg-transparent outline-none w-full placeholder:text-white/40"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            <label className="group grid gap-1">
              <span className="text-[11px] text-white/60">Password</span>
              <div className="flex items-center gap-2 rounded-xl px-3 py-3 bg-black/30 border border-white/10 ring-0 focus-within:ring-1 focus-within:ring-white/30">
                <Lock size={16} className="opacity-70" />
                <input
                  className="bg-transparent outline-none w-full placeholder:text-white/40"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder={mode === "login" ? "Your password" : "Create a password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 h-12 rounded-xl font-semibold text-base text-[#0f1720] w-full transition-all duration-200 hover:-translate-y-[1px] active:translate-y-[1px] hover:shadow-[0_0_0_2px_rgba(227,57,85,.25)] flex items-center justify-center"
              style={{ background: WC_PINK }}
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} /> Please wait…
                </span>
              ) : mode === "login" ? (
                <span className="inline-flex items-center gap-2">
                  Sign in <ArrowRight size={16} />
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Create account <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <div className="mt-3 text-sm text-white/80">
            {mode === "login" ? (
              <>
                Don’t have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="underline underline-offset-2"
                >
                  Create one
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="underline underline-offset-2"
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          <div className="mt-6 text-xs text-white/60">
            By continuing you agree to our processing for compliance and logistics purposes.
          </div>
        </div>
      </section>

      {/* footer */}
      <footer className="py-8">
        <div className="mx-auto max-w-[1200px] px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a className="flex items-center gap-2 text-white font-extrabold" href="#">
            <img src="/wc-logo.png" alt="Wine Connect" className="h-7 w-auto" />
            <span className="sr-only">Wine Connect</span>
          </a>
          <small className="text-white/80 leading-tight text-center sm:text-right">
            © {new Date().getFullYear()} Wine Connect — SPST
          </small>
        </div>
      </footer>
    </main>
  );
}
