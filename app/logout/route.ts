import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
export async function POST(req:Request){
  const supa=createSupabaseServer();
  await supa.auth.signOut();
  return NextResponse.redirect(new URL("/", req.url));
}
