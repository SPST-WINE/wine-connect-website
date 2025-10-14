import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// This route finalizes the session after the magic link (or email confirmation).
export async function GET(req: Request) {
  const supabase = createSupabaseServer();

  // Important: pass a string URL, not a URL object (avoids TS error you saw before)
  await supabase.auth.exchangeCodeForSession(req.url);

  // After session is set via cookies, send the user to the buyer hub
  return NextResponse.redirect(new URL("/buyer-home", req.url));
}
