import React from "react";
import Link from "next/link";

type Crumb = { href: string; label: string; current?: boolean };

export default function AdminPageHeader({
  title,
  subtitle,
  breadcrumbs = [],
  right,
}: {
  title: string;
  subtitle?: string;
  breadcrumbs?: Crumb[];
  right?: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 md:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {breadcrumbs.length > 0 && (
            <nav className="mb-1 text-xs text-white/60 flex flex-wrap items-center gap-1.5">
              {breadcrumbs.map((b, i) => (
                <span key={b.href} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-white/30">/</span>}
                  {b.current ? (
                    <span className="text-white">{b.label}</span>
                  ) : (
                    <Link href={b.href} className="hover:underline">
                      {b.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>
          )}
          <h1 className="text-2xl md:text-3xl font-extrabold text-white">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-white/70">{subtitle}</p> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
    </section>
  );
}
