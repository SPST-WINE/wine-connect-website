import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req:Request){
  const supa=createSupabaseServer();
  const form=await req.formData();
  const wineId=String(form.get("wineId"));
  const qty=Number(form.get("qty")||1);
  const listType=String(form.get("listType")||"sample") as "sample"|"order";

  const { data:{ user } }=await supa.auth.getUser();
  if(!user) return NextResponse.redirect(new URL("/login", req.url));

  const { data:buyer, error:bErr }=await supa.from("buyers").select("id").eq("auth_user_id", user.id).single();
  if(bErr || !buyer) return NextResponse.json({error:"Buyer not found"}, {status:400});

  const { error }=await supa.rpc("add_to_cart", { p_buyer: buyer.id, p_wine: wineId, p_qty: qty, p_list: listType });
  if(error) return NextResponse.json({error:error.message},{status:400});

  return NextResponse.redirect(new URL("/catalog?added=1", req.url));
}
