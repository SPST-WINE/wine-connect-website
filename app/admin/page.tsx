// app/admin/page.tsx
export const dynamic = "force-dynamic";

import { createSupabaseServer } from "@/lib/supabase/server";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFooter from "@/components/admin/AdminFooter";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

async function countTable(supa: ReturnType<typeof createSupabaseServer>, table: string) {
  const { count } = await supa.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminDashboard() {
  const supa = createSupabaseServer();

  // Auth
  const {
    data: { user },
  } = await supa.auth.getUser();

  // Se non loggato → avviso
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col text-white" style={{ background: BG }}>
        <AdminHeader />
        <main className="flex-1 px-5 grid place-items-center">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-6 text-center text-white/85">
            Please <a className="underline" href="/login">sign in</a> to access the admin.
          </div>
        </main>
        <AdminFooter />
      </div>
    );
  }

  // Guard (tabella "admins" opzionale): se esiste, consente solo gli utenti presenti.
  let isAdmin = true;
  try {
    const { data: adminRow } = await supa
      .from("admins")
      .select("auth_user_id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    // se la tabella esiste e non trova la riga → non admin
    if (adminRow === null) isAdmin = false;
  } catch {
    // se la tabella non esiste o non è accessibile, non blocchiamo l’accesso (ambiente di dev)
    isAdmin = true;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col text-white" style={{ background: BG }}>
        <AdminHeader />
        <main className="flex-1 px-5 grid place-items-center">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-6 text-center">
            You don’t have access to the admin area.
          </div>
        </main>
        <AdminFooter />
      </div>
    );
  }

  // Stats
  const [wines, wineries, buyers, orders] = await Promise.all([
    countTable(supa, "wines"),
    countTable(supa, "wineries"),
    countTable(supa, "buyers"),
    countTable(supa, "orders"),
  ]);

  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: BG }}>
      <AdminHeader />

      <main className="flex-1 px-5">
        <div className="mx-auto max-w-[1200px] py-6 space-y-6">
          {/* Title */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-white/60">
                  Admin console
                </div>
                <h1 className="mt-1 text-3xl md:text-4xl font-extrabold">
                  Dashboard
                </h1>
                <p className="mt-1 text-sm text-white/70">
                  Quick overview of catalog and activity.
                </p>
              </div>
            </div>
          </section>

          {/* KPI cards */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Wines" value={wines} href="/admin/wines" />
            <KpiCard label="Wineries" value={wineries} href="/admin/wineries" />
            <KpiCard label="Buyers" value={buyers} href="/admin/buyers" />
            <KpiCard label="Orders" value={orders} href="/admin/orders" />
          </section>

          {/* Quick actions */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="text-[11px] uppercase tracking-wider text-white/60 mb-3">
              Quick actions
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <QuickLink href="/admin/wines" title="Manage wines" desc="Add, edit and publish wines." />
              <QuickLink href="/admin/wineries" title="Manage wineries" desc="Keep producer data up to date." />
              <QuickLink href="/admin/orders" title="Orders" desc="Track requests, shipments and status." />
            </div>
          </section>
        </div>
      </main>

      <AdminFooter />
    </div>
  );
}

/* ---------- small UI helpers ---------- */

function KpiCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <a
      href={href}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:bg-white/[0.06] transition"
    >
      <div className="text-xs uppercase tracking-wider text-white/60">{label}</div>
      <div className="mt-2 text-4xl font-black">{value.toLocaleString()}</div>
    </a>
  );
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a
      href={href}
      className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition"
    >
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-white/70 mt-0.5">{desc}</div>
    </a>
  );
}
