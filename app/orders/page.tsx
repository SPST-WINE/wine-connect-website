import Link from "next/link";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function OrdersList(){
  const supa=createSupabaseServer();
  const { data:{ user } }=await supa.auth.getUser();
  if(!user) return <div className="mt-10">Devi <a className="underline" href="/login">accedere</a>.</div>;

  const { data:buyer }=await supa.from("buyers").select("id").eq("auth_user_id", user.id).single();
  if(!buyer) return <div>Profilo buyer non trovato.</div>;

  const { data:orders }=await supa.from("orders")
    .select("id, type, status, created_at, totals")
    .eq("buyer_id", buyer.id)
    .order("created_at", { ascending:false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">I tuoi ordini</h1>
        <Link href="/catalog" className="text-sm underline">Vai al catalogo</Link>
      </div>

      <ul className="grid gap-3">
        {(orders||[]).map((o:any)=>(
          <li key={o.id} className="rounded border bg-white p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">#{o.id.slice(0,8)} • {o.type.toUpperCase()}</div>
              <div className="text-sm text-neutral-600">
                Stato: {o.status} • {new Date(o.created_at).toLocaleString()}
              </div>
            </div>
            <Link href={`/orders/${o.id}`} className="text-sm underline">Dettaglio</Link>
          </li>
        ))}
        {(orders||[]).length===0 && (
          <li className="rounded border bg-white p-4 text-sm text-neutral-600">
            Nessun ordine ancora.
          </li>
        )}
      </ul>
    </div>
  );
}
