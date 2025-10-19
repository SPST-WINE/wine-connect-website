export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";
import {
  AdminToolbar,
  AdminCard,
  AdminInput,
  AdminTextarea,
  AdminPrimaryButton,
} from "@/components/admin/UI";

export default async function NewWinery() {
  const { ok } = await requireAdmin();
  if (!ok)
    return (
      <main className="flex-1 px-5 grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center">Non autorizzato.</div>
      </main>
    );

  return (
    <main className="flex-1 px-5">
      <div className="mx-auto max-w-[1000px] py-6 space-y-6">
        <AdminToolbar
          title="New winery"
          right={
            <Link href="/admin/wineries" className="rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5">
              ← All wineries
            </Link>
          }
        />

        <AdminCard className="p-5 grid gap-4 max-w-2xl">
          <form action="/api/admin/wineries/create" method="post" className="grid gap-4">
            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Name *</span>
              <AdminInput name="name" required />
            </label>

            <div className="grid md:grid-cols-2 gap-3">
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Region</span>
                <AdminInput name="region" />
              </label>
              <label className="grid gap-1">
                <span className="text-[12px] text-white/70">Country</span>
                <AdminInput name="country" />
              </label>
            </div>

            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Website</span>
              <AdminInput name="website" placeholder="https://..." />
            </label>

            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Description</span>
              <AdminTextarea name="description" rows={5} />
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-white/85">
              <input type="checkbox" name="active" defaultChecked />
              Active winery
            </label>

            <div className="pt-2">
              <AdminPrimaryButton>Create winery</AdminPrimaryButton>
            </div>
          </form>
        </AdminCard>
      </div>
    </main>
  );
}
