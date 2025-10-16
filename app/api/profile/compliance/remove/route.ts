import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

type Kind = "importer_license" | "company_vat";

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
    const docId = String(form.get("docId") || "");

    if (!buyerId || !docId || (kind !== "importer_license" && kind !== "company_vat")) {
      return NextResponse.redirect(new URL("/profile?err=not_found", req.url), 307);
    }

    // --- Ownership check ---
    const { data: buyer, error: buyerErr } = await supa
      .from("buyers")
      .select("id, auth_user_id")
      .eq("id", buyerId)
      .maybeSingle();

    if (buyerErr || !buyer || buyer.auth_user_id !== user.id) {
      console.log("[compliance-remove] forbidden", { buyerErr, buyer, userId: user.id });
      return NextResponse.redirect(new URL("/profile?err=forbidden", req.url), 307);
    }

    // --- Fetch record ---
    const { data: rec, error: recErr } = await supa
      .from("compliance_records")
      .select("id, documents")
      .eq("buyer_id", buyerId)
      .maybeSingle();

    if (recErr || !rec) {
      console.log("[compliance-remove] record not found", recErr);
      return NextResponse.redirect(new URL("/profile?err=not_found", req.url), 307);
    }

    const prev = (rec.documents ?? {}) as Record<string, any>;
    const arr = Array.isArray(prev[kind]) ? (prev[kind] as any[]) : [];

    // Se non presente, comunque facciamo redirect "not_found"
    if (!arr.some((d) => d?.id === docId)) {
      return NextResponse.redirect(new URL("/profile?err=not_found", req.url), 307);
    }

    // Soft-delete
    const next = arr.map((d) => (d?.id === docId ? { ...d, hidden: true } : d));
    const nextDocs = { ...prev, [kind]: next };

    const { error: upErr } = await supa
      .from("compliance_records")
      .update({ documents: nextDocs })
      .eq("buyer_id", buyerId);

    if (upErr) {
      console.log("[compliance-remove] update error", upErr);
      return NextResponse.redirect(new URL("/profile?err=save_failed", req.url), 307);
    }

    return NextResponse.redirect(new URL("/profile?ok=document_removed", req.url), 307);
  } catch (e) {
    console.error("[compliance-remove] unexpected", e);
    return NextResponse.redirect(new URL("/profile?err=save_failed", req.url), 307);
  }
}
