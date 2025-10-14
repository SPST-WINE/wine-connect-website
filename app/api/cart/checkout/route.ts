import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(req:Request){
  const supa=createSupabaseServer();
  const form=await req.formData();
  const type=String(form.get("type")||"sample") as "sample"|"order";
  const addressId=String(form.get("addressId"));

  const { data:{ user } }=await supa.auth.getUser();
  if(!user) return NextResponse.redirect(new URL("/login", req.url));

  const { data:buyer }=await supa.from("buyers").select("id").eq("auth_user_id", user.id).single();
  if(!buyer) return NextResponse.json({error:"Buyer not found"},{status:400});

  const { data:orderId, error }=await supa.rpc("checkout_cart", { p_buyer: buyer.id, p_type: type, p_shipping_address: addressId });
  if(error) return NextResponse.json({error:error.message},{status:400});

  return NextResponse.redirect(new URL(`/orders/${orderId}`, req.url));
}
