// app/api/korea/cart/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type Intent = "check_out_later" | "know_more";

type Item = {
  wineryId: string;
  wineryName: string;
  sampleSize: number;
};

type Body = {
  leadId?: string;
  intent?: Intent;
  items?: Item[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    const leadId = body.leadId;
    const intent = body.intent;
    const items = body.items || [];

    if (!leadId || !intent || items.length === 0) {
      return NextResponse.json(
        { error: "invalid_payload" },
        { status: 400 }
      );
    }

    const totalBottles = items.reduce(
      (sum, item) => sum + (item.sampleSize || 0),
      0
    );

    const supa = getSupabaseAdmin();

    const { data: requestRow, error: reqErr } = await supa
      .from("korea_event_sample_requests")
      .insert({
        lead_id: leadId,
        intent,
        total_bottles: totalBottles,
      })
      .select("id")
      .single();

    if (reqErr) {
      console.error("[korea/cart] insert request error", reqErr);
      return NextResponse.json(
        { error: "db_error" },
        { status: 500 }
      );
    }

    const requestId = requestRow?.id as string;

    const rows = items.map((item) => ({
      request_id: requestId,
      winery_id: null, // opzionale: collega a tabella wineries se vuoi
      winery_name: item.wineryName,
      sample_size: item.sampleSize,
    }));

    const { error: itemsErr } = await supa
      .from("korea_event_sample_request_items")
      .insert(rows);

    if (itemsErr) {
      console.error("[korea/cart] insert items error", itemsErr);
      return NextResponse.json(
        { error: "db_error" },
        { status: 500 }
      );
    }

    // Optional: notifica flusso interno (per email di autenticazione ecc.)
    const webhookUrl = process.env.WC_KOREA_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "korea_event_cart",
            leadId,
            intent,
            totalBottles,
            items,
            requestId,
          }),
        });
      } catch (err) {
        console.error("[korea/cart] webhook error", err);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[korea/cart] unexpected error", err);
    return NextResponse.json(
      { error: "unexpected_error" },
      { status: 500 }
    );
  }
}
