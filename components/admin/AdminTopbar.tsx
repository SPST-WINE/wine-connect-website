// components/admin/AdminTopbar.tsx
import Link from "next/link";

type Tab = "dashboard" | "orders" | "wineries" | "wines" | "buyers";

export default function AdminTopbar({ active }: { active?: Tab }) {
  const item = (href: string, label: string, key: Tab) => (
    <Link
      key={key}
      href={href}
      className={[
        "rounded-lg px-3 py-1.5 text-sm transition border",
        active === key
          ? "bg-white/10 text-white border-white/15"
          : "bg-black/30 text-white/80 border-white/10 hover:bg-black/40 hover:text-white",
      ].join(" ")}
    >
      {label}
    </Link>
  );

  return (
    <header className="h-14 flex items-center justify-between px-5 border-b border-white/10 bg-black/30 sticky top-0 z-40 backdrop-blur">
      <Link href="/admin" className="flex items-center gap-2 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/wc-logo.png" alt="Wine Connect" className="h-5 w-auto" />
        <span className="font-semibold">Admin</span>
      </Link>
      <nav className="flex items-center gap-2">
        {item("/admin", "Dashboard", "dashboard")}
        {item("/admin/orders", "Orders", "orders")}
        {item("/admin/wineries", "Wineries", "wineries")}
        {item("/admin/wines", "Wines", "wines")}
        {item("/admin/buyers", "Buyers", "buyers")}
      </nav>
    </header>
  );
}
