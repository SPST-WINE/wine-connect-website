"use client";

import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";

/** WC palette */
const WC_PINK = "#E33955";
const LOGO_PNG = "/wc-logo.png";

function LoginInner() {
  const r = useRouter();
  const sp = useSearchParams();
  const modeQuery = sp.get("mode");
  const [mode] = useState<"login" | "signup">(
    modeQuery === "signup" ? "signup" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const supa = supabaseBrowser();

    try {
      const res =
        mode === "login"
          ? await supa.auth.signInWithPassword({ email, password })
          : await supa.auth.signUp({
              email,
              password,
              options: {
                data: { company_name: "", country: "", name: "" },
                emailRedirectTo: `${window.location.origin}/auth/callback`,
              },
            });

      if (res.error) {
        setErr(res.error.message);
      } else {
        r.push("/buyer-home");
      }
    } catch (e: any) {
      setErr(e?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)",
      }}
    >
      {/* Top bar */}
      <header className="h-14 flex items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2 text-white">
          <img src={LOGO_PNG} alt="Wine Connect" className="h-6 w-auto" />
          <span className="font-semibold">Wine Connect</span>
        </Link>
        <Link
          href="/"
          className="text-xs text-white/70 hover:text-white transition"
        >
          Back to public site
        </Link>
      </header>

      {/* Card */}
      <main className="flex-1 grid place-items-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-5 py-6 shadow-[0_10px_40px_rgba(0,0,0,.35)]"
        >
          <div className="text-xs uppercase tracking-wider text-white/60">
            Buyer access
          </div>
          <h1 className="mt-1 text-2xl font-extrabold text-white">
            Sign in to Wine Connect
          </h1>
          <p className="mt-1 text-sm text-white/70">
            Use your email and password to access your buyer hub.
          </p>

          <form onSubmit={submit} className="mt-5 space-y-3">
            {/* Email */}
            <label className="grid gap-1">
              <span className="text-[11px] text-white/60">Email</span>
              <div className="flex items-center gap-2 rounded-xl bg-black/30 border border-white/10 px-3 py-3 focus-within:ring-1 focus-within:ring-white/30">
                <Mail size={16} className="text-white/50" />
                <input
                  className="bg-transparent outline-none w-full text-white placeholder:text-white/40"
                  placeholder="name@company.com"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </label>

            {/* Password */}
            <label className="grid gap-1">
              <span className="text-[11px] text-white/60">Password</span>
              <div className="flex items-center gap-2 rounded-xl bg-black/30 border border-white/10 px-3 py-3 focus-within:ring-1 focus-within:ring-white/30">
                <Lock size={16} className="text-white/50" />
                <input
                  className="bg-transparent outline-none w-full text-white placeholder:text-white/40"
                  placeholder="Your password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </label>

            {err && (
              <p className="text-sm text-red-300 bg-red-950/40 border border-red-800/40 rounded p-2">
                {err}
              </p>
            )}

            <div className="grid gap-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl font-semibold text-[#0f1720] transition-all duration-200 hover:-translate-y-[1px] active:translate-y-[1px] disabled:opacity-60"
                style={{ background: WC_PINK }}
              >
                {loading ? "Please wait…" : "Sign in"}{" "}
                <ArrowRight className="inline-block ml-1 align-[-2px]" size={16} />
              </button>

              {/* CTA per la signup */}
              <Link
                href="/signup"
                className="w-full h-11 rounded-xl border border-white/15 bg-white/5 text-center grid place-items-center text-white/90 hover:bg-white/10"
              >
                Create an account
              </Link>
            </div>
          </form>

          {/* NOTE: rimosso il link "Don’t have an account? Create one" */}

          <p className="mt-4 text-[11px] text-white/55">
            By continuing you agree to our{" "}
            <Link href="/privacy" className="underline hover:text-white">
              privacy policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="underline hover:text-white">
              terms of agreement
            </Link>
            .
          </p>
        </motion.div>
      </main>

      {/* Sticky footer */}
      <footer className="mt-auto py-6 px-5 text-right text-white/70 text-xs">
        © {new Date().getFullYear()} Wine Connect — SPST
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <LoginInner />
    </Suspense>
  );
}
