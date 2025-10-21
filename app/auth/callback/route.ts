// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = createSupabaseServer();

  // Supabase passa ?code=...&next=...
  // Usa l'URL completo: è quello che si aspetta exchangeCodeForSession
  await supabase.auth.exchangeCodeForSession(new URL(request.url));

  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/buyer-home";
  return NextResponse.redirect(new URL(next, request.url));
}
