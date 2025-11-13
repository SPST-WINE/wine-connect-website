// app/api/korea/register/route.ts
import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type BuyerType = "importer" | "no_import_license";

type Body = {
  email?: string;
  companyName?: string;
  buyerType?: BuyerType;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const email = (body.email || "").trim();
    const companyName = (body.companyName || "").trim();
    const buyerType = body.buyerType;

    if (!email || !companyName || !buyerType) {
      return NextResponse.json(
        { error: "missing_fields" },
        { status: 400 }
      );
    }

    const supa = getSupabaseAdmin();

    const { data, error } = await supa
      .from("korea_event_leads")
      .insert({
        email,
        company_name: companyName,
        buyer_type: buyerType,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[korea/register] insert error", error);
      return NextResponse.json(
        { error: "db_error" },
        { status: 500 }
      );
    }

    const leadId = data?.id as string;

    // Optional: notifica verso Make/Zapier/altro
    const webhookUrl = process.env.WC_KOREA_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "korea_event_lead",
            leadId,
            email,
            companyName,
            buyerType,
          }),
        });
      } catch (err) {
        console.error("[korea/register] webhook error", err);
        // non blocchiamo l'utente se il webhook fallisce
      }
    }

    return NextResponse.json({ leadId });
  } catch (err) {
    console.error("[korea/register] unexpected error", err);
    return NextResponse.json(
      { error: "unexpected_error" },
      { status: 500 }
    );
  }
}
