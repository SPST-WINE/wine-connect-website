import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const supabase = createSupabaseServer();
  await supabase.auth.exchangeCodeForSession(req.url);
  return NextResponse.redirect(new URL("/buyer-home", req.url));
}
