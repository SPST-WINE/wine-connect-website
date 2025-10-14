// app/auth/callback/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = createSupabaseServer();

  // Scambia il code nell'URL per una sessione *e* scrive i cookie
  await supabase.auth.exchangeCodeForSession(new URL(req.url));

  // Dove atterrare dopo conferma/login via magic link
  return NextResponse.redirect(new URL("/catalog", req.url));
}
