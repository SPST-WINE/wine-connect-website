import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

const BUCKET = "compliance";
const MAX_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED = ["application/pdf", "image/png", "image/jpeg"];

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const { data: { user } } = await supa.auth.getUser();
  if (!user) return NextResponse.redirect(new URL("/login", req.url));

  const form = await req.formData();
  const buyerId = form.get("buyerId")?.toString() || "";
  const docType = form.get("docType")?.toString() || "generic";
  const file = form.get("file") as File | null;

  if (!file) return NextResponse.redirect(new URL("/profile?err=no_file", req.url));
  if (file.size > MAX_SIZE) {
    return NextResponse.redirect(new URL("/profile?err=file_too_large", req.url));
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.redirect(new URL("/profile?err=bad_type", req.url));
  }

  // Ownership check
  const { data: buyer } = await supa
    .from("buyers")
    .select("id, auth_user_id")
    .eq("id", buyerId)
    .maybeSingle();

  if (!buyer || buyer.auth_user_id !== user.id) {
    return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
  }

  // Path: compliance/{buyerId}/{timestamp}_{filename}
  const safeName = file.name.replace(/[^\w.\-]+/g, "_");
  const key = `compliance/${buyerId}/${Date.now()}_${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: upErr } = await supa.storage
    .from(BUCKET)
    .upload(key, new Uint8Array(arrayBuffer), {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type || undefined,
    });

  if (upErr) {
    return NextResponse.redirect(new URL("/profile?err=upload_failed", req.url));
  }

  // Public URL (se il bucket è public; altrimenti puoi generare signed URL lato server)
  const { data: pub } = supa.storage.from(BUCKET).getPublicUrl(key);
  const url = pub?.publicUrl ?? null;

  // Upsert compliance record + append doc
  const { data: rec } = await supa
    .from("compliance_records")
    .select("id, documents")
    .eq("buyer_id", buyerId)
    .maybeSingle();

  const newDoc = {
    id: crypto.randomUUID(),
    name: file.name,
    path: key,
    type: docType,
    url,
  };

  const docs = Array.isArray(rec?.documents) ? [...rec!.documents, newDoc] : [newDoc];

  const { error: upsertErr } = await supa
    .from("compliance_records")
    .upsert(
      { buyer_id: buyerId, mode: rec?.mode ?? "self", documents: docs },
      { onConflict: "buyer_id" }
    );

  if (upsertErr) {
    return NextResponse.redirect(new URL("/profile?err=save_failed", req.url));
  }

  return NextResponse.redirect(new URL("/profile?ok=document_uploaded", req.url));
}
