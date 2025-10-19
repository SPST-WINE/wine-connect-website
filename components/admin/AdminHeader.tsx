"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LOGO_PNG = "/wc-logo.png";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/wineries", label: "Wineries" },
  { href: "/admin/wines", label: "Wines" },
  { href: "/admin/buyers", label: "Buyers" },
];

export default function AdminHeader() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/admin" && pathname?.startsWith(href));

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/30 backdrop-blur supports-[backdrop-filter]:bg-black/20">
      <div className="h-14 px-5 flex items-center justify-between">
        {/* Logo allineato a sinistra (full bleed) */}
        <Link href="/admin" className="flex items-center gap-2 text-white">
          <img src={LOGO_PNG} alt="Wine Connect" className="h-6 w-auto" />
          <span className="font-semibold">Admin</span>
        </Link>

        {/* Nav allineata a destra, full width */}
        <nav className="flex items-center gap-2 text-sm">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "rounded-lg px-3 py-1.5",
                isActive(item.href)
                  ? "bg-white/10 text-white"
                  : "text-white/85 hover:bg-white/5",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
