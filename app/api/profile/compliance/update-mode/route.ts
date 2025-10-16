import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isDebug } from "@/app/api/_utils/debug";

export const dynamic = "force-dynamic";

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
    const mode = String(form.get("mode") || "self") as "self" | "delegate";
    if (!buyerId || !["self", "delegate"].includes(mode)) {
      if (debug) return NextResponse.json({ step: "parse", buyerId, mode, error: "bad_request" }, { status: 400 });
      return NextResponse.redirect(new URL("/profile?err=bad_request", req.url));
    }

    // check ownership
    const { data: buyer, error: buyerErr } = await supa
      .from("buyers")
      .select("id")
      .eq("id", buyerId)
      .eq("auth_user_id", user.id)
      .maybeSingle();

    console.log("[update-mode] buyer check:", { buyerId, userId: user.id, buyer, buyerErr });

    if (!buyer || buyerErr) {
      if (debug) return NextResponse.json({ step: "owner_check", buyer, buyerErr, error: "forbidden" }, { status: 403 });
      return NextResponse.redirect(new URL("/profile?err=forbidden", req.url));
    }

    const { data: rec, error: recErr } = await supa
      .from("compliance_records")
      .select("documents")
      .eq("buyer_id", buyerId)
      .maybeSingle();

    console.log("[update-mode] existing record:", { rec, recErr });

    const docs = Array.isArray(rec?.documents) ? rec!.documents : [];

    const { error: upErr } = await supa
      .from("compliance_records")
      .upsert({ buyer_id: buyerId, mode, documents: docs }, { onConflict: "buyer_id" });

    console.log("[update-mode] upsert result:", { upErr });

    if (debug) return NextResponse.json({ ok: !upErr, upErr, mode, docs });

    const u = new URL("/profile", req.url);
    if (upErr) u.searchParams.set("err", "update_failed");
    else u.searchParams.set("ok", "compliance_mode_saved");
    return NextResponse.redirect(u);
  } catch (e: any) {
    console.error("[update-mode] fatal:", e);
    if (isDebug(req)) return NextResponse.json({ error: String(e?.message || e) }, { status: 500 });
    return NextResponse.redirect(new URL("/profile?err=server_error", req.url));
  }
}
