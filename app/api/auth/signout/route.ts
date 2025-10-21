// app/api/auth/signout/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST() {
  const supa = createSupabaseServer();
  await supa.auth.signOut().catch(() => {});
  // Redirect a /login (puoi cambiare destinazione)
  return NextResponse.redirect(
    new URL(
      "/login",
      process.env.NEXT_PUBLIC_BASE_URL || "https://www.wearewineconnect.com"
    )
  );
}
