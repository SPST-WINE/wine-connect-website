import { createSupabaseServer } from "@/lib/supabase/server";

export default async function OrderPage({ params }:{ params:{ id:string }}) {
  const supa=createSupabaseServer();
  const { data:order }=await supa.from("orders").select("*").eq("id", params.id).single();
  if(!order) return <div>Ordine non trovato.</div>;
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Ordine</h1>
      <pre className="bg-white p-4 rounded border">{JSON.stringify(order, null, 2)}</pre>
    </div>
  );
}
