import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = createSupabaseServer();
  // scambia il code nell'URL per una sessione + set cookie
  await supabase.auth.exchangeCodeForSession(new URL(req.url));
  // dove atterrare dopo la conferma/login via link
  return NextResponse.redirect(new URL("/catalog", req.url));
}
