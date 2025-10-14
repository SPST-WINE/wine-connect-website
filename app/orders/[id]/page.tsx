import { createSupabaseServer } from "@/lib/supabase/server";

export default async function OrderPage({ params }: { params: { id: string }}) {
  const supabase = createSupabaseServer();
  const { data: order } = await supabase.from("orders").select("*").eq("id", params.id).single();
  if (!order) return <div>Order not found.</div>;
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold">Order</h1>
      <pre className="bg-white p-4 rounded border">{JSON.stringify(order, null, 2)}</pre>
    </div>
  );
}
