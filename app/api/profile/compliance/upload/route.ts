import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

// Limiti/validazioni
const MAX_MB = 10;
const MAX_BYTES = MAX_MB * 1024 * 1024;
const ALLOWED = ["application/pdf", "image/png", "image/jpeg"];

type Kind = "importer_license" | "company_vat";

function safeFileName(name: string) {
  const base = name.normalize("NFKD").replace(/[^\w.-]+/g, "_");
  return base.slice(0, 140);
}

export async function POST(req: NextRequest) {
  try {
    const supa = createSupabaseServer();

    // --- Auth ---
    const { data: { user } } = await supa.auth.getUser();
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url), 307);
    }

    // --- Form data ---
    const form = await req.formData();
    const buyerId = String(form.get("buyerId") || "");
    const kind = String(form.get("kind") || "") as Kind;
    const file = form.get("file") as File | null;

    // Validazioni form
    if (!buyerId || !file || (kind !== "importer_license" && kind !== "company_vat")) {
      return NextResponse.redirect(new URL("/profile?err=upload_failed", req.url), 307);
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.redirect(new URL("/profile?err=file_too_large", req.url), 307);
    }
    if (!ALLOWED.includes(file.type)) {
      return NextResponse.redirect(new URL("/profile?err=bad_type", req.url), 307);
    }

    // --- Ownership check ---
    const { data: buyer, error: buyerErr } = await supa
      .from("buyers")
      .select("id, auth_user_id")
      .eq("id", buyerId)
      .maybeSingle();

    if (buyerErr || !buyer || buyer.auth_user_id !== user.id) {
      console.log("[compliance-upload] forbidden", { buyerErr, buyer, userId: user.id });
      return NextResponse.redirect(new URL("/profile?err=forbidden", req.url), 307);
    }

    // --- Upload su bucket 'compliance' ---
    const fileName = `${crypto.randomUUID()}-${safeFileName(file.name)}`;
    const path = `compliance/${buyerId}/${fileName}`;

    const { error: upErr } = await supa.storage
      .from("compliance")
      .upload(path, file, { upsert: false, contentType: file.type });

    if (upErr) {
      console.log("[compliance-upload] storage error", upErr);
      return NextResponse.redirect(new URL("/profile?err=upload_failed", req.url), 307);
    }

    const { data: urlData } = supa.storage.from("compliance").getPublicUrl(path);
    const publicUrl = urlData.publicUrl;

    // --- Leggo/normalizzo il record di compliance ---
    const { data: rec, error: recErr } = await supa
      .from("compliance_records")
      .select("id, mode, documents")
      .eq("buyer_id", buyerId)
      .maybeSingle();

    if (recErr) {
      console.log("[compliance-upload] fetch record error", recErr);
      return NextResponse.redirect(new URL("/profile?err=save_failed", req.url), 307);
    }

    const prev = (rec?.documents ?? {}) as Record<string, any>;
    const arr = Array.isArray(prev[kind]) ? (prev[kind] as any[]) : [];

    const newItem = {
      id: crypto.randomUUID(),
      name: file.name,
      url: publicUrl,
      uploaded_at: new Date().toISOString(),
      hidden: false, // visibile in UI
    };

    const nextDocs = { ...prev, [kind]: [...arr, newItem] };

    // --- Upsert (mantiene mode se presente, default "self") ---
    const { error: saveErr } = await supa
      .from("compliance_records")
      .upsert(
        {
          buyer_id: buyerId,
          mode: (rec?.mode ?? "self") as any,
          documents: nextDocs,
        },
        { onConflict: "buyer_id" }
      );

    if (saveErr) {
      console.log("[compliance-upload] upsert error", saveErr);
      return NextResponse.redirect(new URL("/profile?err=save_failed", req.url), 307);
    }

    return NextResponse.redirect(new URL("/profile?ok=document_uploaded", req.url), 307);
  } catch (e) {
    console.error("[compliance-upload] unexpected", e);
    return NextResponse.redirect(new URL("/profile?err=upload_failed", req.url), 307);
  }
}
