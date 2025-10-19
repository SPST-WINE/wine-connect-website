"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type Props = { cartCount?: number };

function NavLink({
  href,
  label,
  active,
  children,
}: {
  href: string;
  label: string;
  active: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-xl px-3 py-2 text-sm font-medium transition",
        active
          ? "bg-white/15 text-white"
          : "text-white/80 hover:text-white hover:bg-white/10",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {children ?? label}
    </Link>
  );
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="18"
      height="18"
      className="inline -mt-0.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 6h15l-1.5 9h-12z" />
      <path d="M6 6L5 3H2" />
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
    </svg>
  );
}

export default function SiteHeaderClient({ cartCount = 0 }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/buyer-home") return pathname === "/buyer-home";
    if (href === "/catalog") return pathname.startsWith("/catalog");
    if (href === "/profile") return pathname.startsWith("/profile");
    if (href === "/orders") return pathname.startsWith("/orders");
    if (href === "/cart/samples") return pathname.startsWith("/cart/samples");
    return pathname === href;
  };

  const badge = useMemo(
    () =>
      cartCount > 0 ? (
        <span className="ml-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-[#E33955] px-1.5 text-xs font-semibold text-white">
          {cartCount}
        </span>
      ) : null,
    [cartCount]
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[rgba(10,12,20,0.65)] backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/buyer-home" className="flex items-center gap-2 text-white">
          <img src="/wc-logo.png" alt="Wine Connect" className="h-6 w-auto" />
          <span className="font-semibold">Wine Connect</span>
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink href="/buyer-home" label="Home" active={isActive("/buyer-home")} />
          <NavLink href="/catalog" label="Catalog" active={isActive("/catalog")} />
          <NavLink href="/profile" label="Profile" active={isActive("/profile")} />
          <NavLink href="/orders" label="My Orders" active={isActive("/orders")} />
          <NavLink
            href="/cart/samples"
            label="Sample cart"
            active={isActive("/cart/samples")}
          >
            <span className="inline-flex items-center gap-2">
              <CartIcon />
              <span>Sample cart</span>
              {badge}
            </span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
