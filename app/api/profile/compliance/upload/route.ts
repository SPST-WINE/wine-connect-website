import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

// Se cambi bucket qui, ricorda di crearlo in Supabase Storage
const BUCKET = "compliance";

export async function POST(req: Request) {
  const supa = createSupabaseServer();

  const {
    data: { user },
  } = await supa.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
  }

  const form = await req.formData();
  const buyerId = String(form.get("buyerId") || "");
  const docType = String(form.get("docType") || "");
  const file = form.get("file") as File | null;

  if (!buyerId || !file || !["importer_license", "company_vat"].includes(docType)) {
    return NextResponse.redirect(new URL("/profile?err=bad_request", req.url));
  }

  // Permessi base: buyer dell'utente
  const { data: buyer } = await supa
    .from("buyers")
    .select("id")
    .eq("id", buyerId)
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!buyer) {
    return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
  }

  // Upload su Storage
  const now = Date.now();
  const safeName = file.name.replace(/[^\w\-.]+/g, "_");
  const path = `${buyerId}/${docType}-${now}-${safeName}`;

  const arrayBuffer = await file.arrayBuffer();
  const { error: upErr } = await supa.storage
    .from(BUCKET)
    .upload(path, new Uint8Array(arrayBuffer), {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type || "application/octet-stream",
    });

  if (upErr) {
    const u = new URL("/profile", req.url);
    u.searchParams.set("err", "upload_failed");
    return NextResponse.redirect(u);
  }

  // URL pubblico o signed; qui usiamo getPublicUrl (rendi il bucket pubblico)
  const { data: pub } = supa.storage.from(BUCKET).getPublicUrl(path);
  const fileUrl = pub?.publicUrl ?? "";

  // Aggiorna compliance_records.documents (append)
  const { data: rec } = await supa
    .from("compliance_records")
    .select("mode, documents")
    .eq("buyer_id", buyerId)
    .maybeSingle();

  const currentDocs = Array.isArray(rec?.documents) ? rec!.documents : [];
  const mode = (rec?.mode === "delegate" ? "delegate" : "self") as "self" | "delegate";

  const newDoc = {
    id: `${docType}-${now}`,
    type: docType,
    url: fileUrl,
    name: file.name,
    uploaded_at: new Date().toISOString(),
  };

  const { error: upsertErr } = await supa
    .from("compliance_records")
    .upsert(
      { buyer_id: buyerId, mode, documents: [...currentDocs, newDoc] },
      { onConflict: "buyer_id" }
    );

  const u = new URL("/profile", req.url);
  if (upsertErr) {
    u.searchParams.set("err", "save_failed");
  } else {
    u.searchParams.set("ok", "document_uploaded");
  }
  return NextResponse.redirect(u);
}
