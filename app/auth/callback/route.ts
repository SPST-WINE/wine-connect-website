import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = createSupabaseServer();

  // Scambia il `code` presente nell'URL per una sessione e imposta i cookie
  // Qui serve una STRINGA, non `new URL(...)`
  await supabase.auth.exchangeCodeForSession(req.url);

  // Atterra nel catalogo (puoi cambiare la destinazione)
  return NextResponse.redirect(new URL("/catalog", req.url));
}
