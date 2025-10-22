// app/auth/callback/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const supabase = createSupabaseServer();

  // IMPORTANT: passiamo una STRINGA, non new URL(...)
  await supabase.auth.exchangeCodeForSession(request.url);

  // Supporta ?next=/qualcosa, altrimenti vai su /buyer-home
  const url = new URL(request.url);
  const next = url.searchParams.get("next") || "/buyer-home";

  return NextResponse.redirect(new URL(next, url.origin));
}
