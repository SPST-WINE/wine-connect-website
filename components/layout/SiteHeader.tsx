// components/layout/SiteHeader.tsx
import SiteHeaderClient from "./SiteHeaderClient";
import { createSupabaseServer } from "@/lib/supabase/server";

export default async function SiteHeader() {
  const supabase = createSupabaseServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartCount = 0;

  if (user) {
    // risolvi buyer
    const { data: buyer } = await supabase
      .from("buyers")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();

    if (buyer) {
      // trova carrello "sample" aperto
      const { data: cart } = await supabase
        .from("carts")
        .select("id")
        .eq("buyer_id", buyer.id)
        .eq("type", "sample")
        .eq("status", "open")
        .maybeSingle();

      if (cart) {
        // somma quantita delle righe
        const { data: items } = await supabase
          .from("cart_items")
          .select("quantity")
          .eq("cart_id", cart.id);

        cartCount = (items ?? []).reduce((acc, it) => acc + Number(it.quantity || 0), 0);
      }
    }
  }

  return <SiteHeaderClient cartCount={cartCount} />;
}
