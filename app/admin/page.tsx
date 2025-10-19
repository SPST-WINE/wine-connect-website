// app/admin/page.tsx
export const dynamic = "force-dynamic";

import { createSupabaseServer } from "@/lib/supabase/server";

async function countTable(supa: ReturnType<typeof createSupabaseServer>, table: string) {
  const { count } = await supa.from(table).select("*", { count: "exact", head: true });
  return count ?? 0;
}

export default async function AdminDashboard() {
  const supa = createSupabaseServer();
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    return (
      <main className="flex-1 px-5 grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-6 text-center text-white/85">
          Please <a className="underline" href="/login">sign in</a> to access the admin.
        </div>
      </main>
    );
  }

  // Guard opzionale su tabella admins
  let isAdmin = true;
  try {
    const { data } = await supa.from("admins").select("auth_user_id").eq("auth_user_id", user.id).maybeSingle();
    if (data === null) isAdmin = false;
  } catch {
    isAdmin = true; // se la tabella non c’è, non blocchiamo (dev)
  }

  if (!isAdmin) {
    return (
      <main className="flex-1 px-5 grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur p-6 text-center">
          You don’t have access to the admin area.
        </div>
      </main>
    );
  }

  const [wines, wineries, buyers, orders] = await Promise.all([
    countTable(supa, "wines"),
    countTable(supa, "wineries"),
    countTable(supa, "buyers"),
    countTable(supa, "orders"),
  ]);

  return (
    <main className="flex-1 px-5">
      <div className="mx-auto max-w-[1200px] py-6 space-y-6">
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="text-xs uppercase tracking-wider text-white/60">Admin console</div>
          <h1 className="mt-1 text-3xl md:text-4xl font-extrabold">Dashboard</h1>
          <p className="mt-1 text-sm text-white/70">Quick overview of catalog and activity.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard label="Wines" value={wines} href="/admin/wines" />
          <KpiCard label="Wineries" value={wineries} href="/admin/wineries" />
          <KpiCard label="Buyers" value={buyers} href="/admin/buyers" />
          <KpiCard label="Orders" value={orders} href="/admin/orders" />
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <div className="text-[11px] uppercase tracking-wider text-white/60 mb-3">Quick actions</div>
          <div className="grid gap-3 sm:grid-cols-3">
            <QuickLink href="/admin/wines" title="Manage wines" desc="Add, edit and publish wines." />
            <QuickLink href="/admin/wineries" title="Manage wineries" desc="Keep producer data up to date." />
            <QuickLink href="/admin/orders" title="Orders" desc="Track requests, shipments and status." />
          </div>
        </section>
      </div>
    </main>
  );
}

function KpiCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <a href={href} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:bg-white/[0.06] transition">
      <div className="text-xs uppercase tracking-wider text-white/60">{label}</div>
      <div className="mt-2 text-4xl font-black">{value.toLocaleString()}</div>
    </a>
  );
}

function QuickLink({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <a href={href} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 hover:bg-white/[0.06] transition">
      <div className="font-semibold">{title}</div>
      <div className="text-xs text-white/70 mt-0.5">{desc}</div>
    </a>
  );
}
