"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login"|"signup">("login");
  const [loading, setLoading] = useState(false);
  const r = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = supabaseBrowser();
    const fn = mode==="login"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({
          email, password,
          options: { data: { company_name: "", country: "", name: "" } }
        });
    const { error } = await fn;
    setLoading(false);
    if (!error) r.push("/catalog");
    else alert(error.message);
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-semibold mb-4">{mode==="login"?"Login":"Create account"}</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border rounded p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full py-2 rounded bg-black text-white disabled:opacity-50" disabled={loading}>
          {loading? "..." : (mode==="login"?"Login":"Sign up")}
        </button>
      </form>
      <button className="mt-3 text-sm underline" onClick={()=>setMode(mode==="login"?"signup":"login")}>
        {mode==="login" ? "Create an account" : "I already have an account"}
      </button>
    </div>
  );
}
