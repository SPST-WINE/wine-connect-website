import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isDebug } from "@/app/api/_utils/debug";

export const dynamic = "force-dynamic";
const BUCKET = "compliance";

export async function POST(req: Request) {
  const debug = isDebug(req);
  const supa = createSupabaseServer();

  try {
    const { data: { user } } = await supa.auth.getUser();
    if (!user) {
      if (debug) return NextResponse.json({ step: "auth", error: "no_user" }, { status: 401 });
      return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
    }

    const form = await req.formData();
    const buyerId = String(form.get("buyerId") || "");
    const docType = String(form.get("docType") || "");
    const file = form.get("file") as File | null;

    if (!buyerId || !file || !["importer_license", "company_vat"].includes(docType)) {
      if (debug) return NextResponse.json({ step: "parse", buyerId, docType, hasFile: !!file, error: "bad_request" }, { status: 400 });
      return NextResponse.redirect(new URL("/profile?err=bad_request", req.url));
    }

    const { data: buyer, error: buyerErr } = await supa
      .from("buyers")
      .select("id")
      .eq("id", buyerId)
      .eq("auth_user_id", user.id)
      .maybeSingle();

    console.log("[upload] buyer check:", { buyerId, userId: user.id, buyer, buyerErr });

    if (!buyer || buyerErr) {
      if (debug) return NextResponse.json({ step: "owner_check", buyer, buyerErr, error: "forbidden" }, { status: 403 });
      return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
    }

    // 1) upload to storage
    const now = Date.now();
    const safeName = file.name.replace(/[^\w\-.]+/g, "_");
    const path = `${buyerId}/${docType}-${now}-${safeName}`;

    const arrayBuffer = await file.arrayBuffer();
    const mime = file.type || "application/octet-stream";

    const { error: upErr } = await supa.storage
      .from(BUCKET)
      .upload(path, new Uint8Array(arrayBuffer), {
        contentType: mime,
        cacheControl: "3600",
        upsert: false,
      });

    console.log("[upload] storage.upload:", { path, mime, upErr });

    if (upErr) {
      if (debug) return NextResponse.json({ step: "storage_upload", path, upErr }, { status: 400 });
      const u = new URL("/profile", req.url); u.searchParams.set("err", "upload_failed"); return NextResponse.redirect(u);
    }

    const { data: pub } = supa.storage.from(BUCKET).getPublicUrl(path);
    const fileUrl = pub?.publicUrl ?? "";
    console.log("[upload] public url:", { fileUrl });

    // 2) append in compliance_records
    const { data: rec, error: recErr } = await supa
      .from("compliance_records")
      .select("mode, documents")
      .eq("buyer_id", buyerId)
      .maybeSingle();

    console.log("[upload] existing record:", { rec, recErr });

    const docs = Array.isArray(rec?.documents) ? rec!.documents : [];
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
      .upsert({ buyer_id: buyerId, mode, documents: [...docs, newDoc] }, { onConflict: "buyer_id" });

    console.log("[upload] upsert result:", { upsertErr });

    if (debug) return NextResponse.json({ ok: !upsertErr, fileUrl, newDoc, upsertErr });

    const u = new URL("/profile", req.url);
    if (upsertErr) u.searchParams.set("err", "save_failed");
    else u.searchParams.set("ok", "document_uploaded");
    return NextResponse.redirect(u);
  } catch (e: any) {
    console.error("[upload] fatal:", e);
    if (isDebug(req)) return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
    return NextResponse.redirect(new URL("/profile?err=server_error", req.url));
  }
}
