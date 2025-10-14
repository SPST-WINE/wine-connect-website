import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supa = createSupabaseServer();
  const ctype = req.headers.get("content-type") || "";
  let buyerId: string, mode: "self"|"delegate_wc", documents: any = undefined;

  if (ctype.includes("application/json")) {
    const body = await req.json();
    buyerId = body.buyerId; mode = body.mode; documents = body.documents;
  } else {
    const form = await req.formData();
    buyerId = String(form.get("buyerId"));
    mode = String(form.get("mode")) as any;
  }

  // upsert record
  const { data: exists } = await supa.from("compliance_records")
    .select("id").eq("buyer_id", buyerId).maybeSingle();

  const payload: any = { buyer_id: buyerId, mode };
  if (documents !== undefined) payload.documents = documents;

  const q = exists
    ? supa.from("compliance_records").update(payload).eq("buyer_id", buyerId).select("*").single()
    : supa.from("compliance_records").insert(payload).select("*").single();

  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
