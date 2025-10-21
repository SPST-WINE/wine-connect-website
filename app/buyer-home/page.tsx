export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ShoppingBasket, UserCog, Rows3 } from "lucide-react";
import { createSupabaseServer } from "@/lib/supabase/server";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

/** WC palette */
const WC_PINK = "#E33955";

export default async function BuyerHome() {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();
  if (!user) redirect("/login");

  // Fetch buyer profile to get contact_name for greeting
  const { data: buyer } = await supa
    .from("buyers")
    .select("contact_name")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  const displayName =
    (buyer?.contact_name as string | undefined) ||
    (user.user_metadata?.name as string | undefined) ||
    (user.user_metadata?.company_name as string | undefined) ||
    user.email?.split("@")[0] ||
    "there";

  return (
    <div
      className="min-h-screen flex flex-col text-white"
      style={{
        background:
          "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)",
      }}
    >
      {/* GLOBAL HEADER */}
      <SiteHeader />

      <main className="flex-1 px-5">
        <div className="mx-auto max-w-5xl py-8">
          {/* Welcome / primary choices */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs tracking-wider uppercase text-white/60">
                  Welcome
                </div>
                <h1 className="mt-1 text-3xl md:text-4xl font-extrabold">
                  Hi {displayName} —{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(90deg, ${WC_PINK}, #ffffff)`,
                    }}
                  >
                    choose how you want to work today
                  </span>
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  Compliance: Self-managed
                </p>
              </div>

              <div className="flex gap-2 shrink-0">
                <Link
                  href="/cart/samples"
                  className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm hover:bg-black/50"
                >
                  <ShoppingBasket size={16} /> Sample cart
                </Link>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm hover:bg-black/50"
                >
                  <UserCog size={16} /> Profile & compliance
                </Link>

                {/* Logout */}
                <form action="/api/auth/signout" method="post">
                  <button
                    className="inline-flex items-center gap-2 rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm hover:bg-black/50"
                    title="Log out"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {/* Tailored service */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-[11px] uppercase tracking-wider text-white/60 mb-2">
                  Tailored service
                </div>
                <h3 className="text-xl font-bold">Get a curated shortlist</h3>
                <p className="text-sm text-white/75 mt-1">
                  Give us your brief (styles, price points, volumes). We’ll
                  build the shortlist and ship a tasting kit.
                </p>
                <Link
                  href="/brief/start"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-[#0f1720]"
                  style={{ background: WC_PINK }}
                >
                  Start a brief <ArrowRight size={16} />
                </Link>
              </div>

              {/* Browse yourself */}
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <div className="text-[11px] uppercase tracking-wider text-white/60 mb-2">
                  Browse yourself
                </div>
                <h3 className="text-xl font-bold">Explore wines & add samples</h3>
                <p className="text-sm text-white/75 mt-1">
                  Filter by region, type, certifications and price. Add samples
                  to cart and request shipment.
                </p>
                <Link
                  href="/catalog"
                  className="mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-[#0f1720]"
                  style={{ background: WC_PINK }}
                >
                  Go to catalog <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          {/* Quick links */}
          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="text-xs tracking-wider uppercase text-white/60 mb-3">
              Quick links
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Link
                href="/catalog"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition flex items-center gap-3"
              >
                <Rows3 size={18} className="text-white/80" />
                <div>
                  <div className="font-semibold">Catalog</div>
                  <div className="text-xs text-white/70">
                    Discover wines and add samples.
                  </div>
                </div>
              </Link>

              <Link
                href="/profile"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition flex items-center gap-3"
              >
                <UserCog size={18} className="text-white/80" />
                <div>
                  <div className="font-semibold">Profile & compliance</div>
                  <div className="text-xs text-white/70">
                    Account, addresses, compliance data.
                  </div>
                </div>
              </Link>

              <Link
                href="/orders"
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition flex items-center gap-3"
              >
                <ShoppingBasket size={18} className="text-white/80" />
                <div>
                  <div className="font-semibold">My orders</div>
                  <div className="text-xs text-white/70">
                    Track your requests and shipments.
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* GLOBAL FOOTER */}
      <SiteFooter />
    </div>
  );
}
