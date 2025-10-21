// app/auth/set/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { access_token, refresh_token, next } = await req.json();

  if (!access_token || !refresh_token) {
    return NextResponse.json({ error: "Missing tokens" }, { status: 400 });
  }

  const supabase = createSupabaseServer();
  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Set dei cookie fatto: ora redirect “hard” alla pagina target
  return NextResponse.redirect(new URL(next || "/buyer-home", req.url));
}
