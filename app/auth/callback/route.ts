// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = createSupabaseServer();

  // Scambia il code per la sessione e scrive i cookie (string, non URL)
  await supabase.auth.exchangeCodeForSession(req.url);

  // Dove atterrare dopo conferma/login
  return NextResponse.redirect(new URL("/catalog", req.url));
}
