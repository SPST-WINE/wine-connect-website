// Server Component
import { createSupabaseServer } from "@/lib/supabase/server";
import BuyerHomeClient from "./ui";

export const dynamic = "force-dynamic";

export default async function BuyerHomePage() {
  const supa = createSupabaseServer();

  // 1) Auth → user
  const { data: { user } } = await supa.auth.getUser();
  if (!user) {
    // hard redirect to login if not authenticated
    return (
      <div className="min-h-[60vh] grid place-items-center">
        <a
          href="/login"
          className="underline text-blue-600"
        >
          Please log in
        </a>
      </div>
    );
  }

  // 2) Buyer profile (linked by auth_user_id)
  const { data: buyer } = await supa
    .from("buyers")
    .select("id, company_name, contact_name, country, compliance_mode")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  // 3) Recent orders (latest 3)
  const { data: orders } = await supa
    .from("orders")
    .select("id, type, status, created_at, tracking_code")
    .eq("buyer_id", buyer?.id ?? "00000000-0000-0000-0000-000000000000")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <BuyerHomeClient
      userEmail={user.email ?? ""}
      buyerName={buyer?.contact_name ?? ""}
      companyName={buyer?.company_name ?? ""}
      country={buyer?.country ?? ""}
      complianceMode={buyer?.compliance_mode ?? "delegate_wc"}
      recentOrders={(orders ?? []).map((o) => ({
        id: o.id,
        type: o.type as "sample" | "order",
        status: o.status as "pending" | "processing" | "shipped" | "completed" | "cancelled",
        created_at: o.created_at as string,
        tracking_code: (o as any).tracking_code ?? null,
      }))}
    />
  );
}
