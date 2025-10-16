import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

const BUCKET = "compliance";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const form = await req.formData();
  const buyerId = form.get("buyerId")?.toString() || "";
  const docId = form.get("docId")?.toString() || "";

  // Ownership
  const { data: buyer } = await supa
    .from("buyers")
    .select("id, auth_user_id")
    .eq("id", buyerId)
    .maybeSingle();
  if (!buyer || buyer.auth_user_id !== user.id) {
    return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
  }

  // Fetch record & find doc
  const { data: rec, error: recErr } = await supa
    .from("compliance_records")
    .select("id, documents")
    .eq("buyer_id", buyerId)
    .maybeSingle();

  if (recErr || !rec) {
    return NextResponse.redirect(new URL("/profile?err=not_found", req.url));
  }

  const docs = Array.isArray(rec.documents) ? rec.documents : [];
  const doc = docs.find((d: any) => d.id === docId);
  const remaining = docs.filter((d: any) => d.id !== docId);

  // Update record (remove doc)
  const { error: upErr } = await supa
    .from("compliance_records")
    .update({ documents: remaining })
    .eq("id", rec.id);

  if (upErr) {
    return NextResponse.redirect(new URL("/profile?err=save_failed", req.url));
  }

  // Delete from storage (best effort)
  if (doc?.path) {
    await supa.storage.from(BUCKET).remove([doc.path]).catch(() => {});
  }

  return NextResponse.redirect(new URL("/profile?ok=document_deleted", req.url));
}
