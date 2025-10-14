export const dynamic = "force-dynamic";

import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Admin · Wine Connect</h1>
        <nav className="flex gap-3 text-sm">
          <Link className="underline" href="/admin">Dashboard</Link>
          <Link className="underline" href="/admin/orders">Ordini</Link>
          <Link className="underline" href="/admin/wineries">Cantine</Link>
          <Link className="underline" href="/admin/wines">Vini</Link>
        </nav>
      </header>
      {children}
    </div>
  );
}
