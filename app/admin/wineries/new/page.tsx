export const dynamic = "force-dynamic";

import Link from "next/link";
import { requireAdmin } from "@/lib/is-admin";

export default async function NewWinery() {
  const { ok } = await requireAdmin();
  if (!ok) {
    return (
      <main className="flex-1 px-5 grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-center">
          Non autorizzato.
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 px-5">
      <div className="mx-auto max-w-[1000px] py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-white/60">Wineries</div>
            <h1 className="mt-1 text-3xl font-extrabold">New winery</h1>
          </div>
          <Link
            className="rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5"
            href="/admin/wineries"
          >
            ← All wineries
          </Link>
        </div>

        {/* Form card */}
        <form
          action="/api/admin/wineries/create"
          method="post"
          className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 grid gap-4 max-w-2xl"
        >
          <label className="grid gap-1">
            <span className="text-[12px] text-white/70">Name *</span>
            <input
              name="name"
              required
              className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
            />
          </label>

          <div className="grid md:grid-cols-2 gap-3">
            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Region</span>
              <input
                name="region"
                className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-[12px] text-white/70">Country</span>
              <input
                name="country"
                className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
              />
            </label>
          </div>

          <label className="grid gap-1">
            <span className="text-[12px] text-white/70">Website</span>
            <input
              name="website"
              placeholder="https://..."
              className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-[12px] text-white/70">Description</span>
            <textarea
              name="description"
              rows={5}
              className="rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none"
            />
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-white/85">
            <input type="checkbox" name="active" defaultChecked />
            Active winery
          </label>

          <div className="pt-2">
            <button
              className="h-11 rounded-xl px-4 font-semibold text-[#0f1720]"
              style={{ background: "#E33955" }}
            >
              Create winery
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
