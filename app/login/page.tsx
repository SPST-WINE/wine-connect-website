"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const r = useRouter();

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
                // importante: dopo la conferma email torna qui
                emailRedirectTo: `${window.location.origin}/auth/callback`,
              },
            });

      if (res.error) {
        setErr(res.error.message);
      } else {
        // login immediato (login) o conferma inviata (signup)
        r.push("/catalog");
      }
    } catch (e: any) {
      setErr(e?.message ?? "Errore inatteso");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-semibold mb-4">
        {mode === "login" ? "Login" : "Crea account"}
      </h1>

      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Password"
          type="password"
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {err && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">
            {err}
          </p>
        )}

        <button
          type="submit"
          className="w-full py-2 rounded bg-black text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "…" : mode === "login" ? "Login" : "Sign up"}
        </button>
      </form>

      <button
        className="mt-3 text-sm underline"
        onClick={() => setMode(mode === "login" ? "signup" : "login")}
      >
        {mode === "login" ? "Crea un account" : "Ho già un account"}
      </button>
    </div>
  );
}
