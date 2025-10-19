// components/admin/UI.tsx
import Link from "next/link";
import React from "react";

/* --------- Card --------- */
export function AdminCard({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-white/10 bg-white/[0.04] ${className}`}
      {...props}
    />
  );
}

/* --------- Toolbar (header sezione con actions) --------- */
export function AdminToolbar({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <AdminCard className="p-5 md:p-6 flex items-center justify-between">
      <div>
        <div className="text-xs uppercase tracking-wider text-white/60">Admin</div>
        <h1 className="mt-1 text-3xl md:text-4xl font-extrabold">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-white/70">{subtitle}</p> : null}
      </div>
      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </AdminCard>
  );
}

/* --------- Buttons --------- */
export function AdminPrimaryButton({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`h-11 rounded-xl px-4 font-semibold text-[#0f1720] ${className}`}
      style={{ background: "#E33955" }}
      {...props}
    />
  );
}

export function AdminGhostButton({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5 ${className}`}
      {...props}
    />
  );
}

export function AdminLinkButton({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-xl border border-white/10 px-3 py-2 text-white/85 hover:bg-white/5 ${className}`}
    >
      {children}
    </Link>
  );
}

/* --------- Inputs --------- */
export function AdminInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none ${className}`}
      {...props}
    />
  );
}

export function AdminTextarea({
  className = "",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={`rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white outline-none ${className}`}
      {...props}
    />
  );
}

export function AdminSelect({
  className = "",
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={`rounded-xl bg-black/30 border border-white/10 px-3 py-2 text-white ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

/* --------- File input (stile coerente) --------- */
export function AdminFileInput({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="file"
      className={`text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-white/15 file:px-3 file:py-1 file:text-white ${className}`}
      {...props}
    />
  );
}

/* --------- Badge --------- */
export function AdminBadge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "success";
  children: React.ReactNode;
}) {
  const map = {
    neutral: "border-white/20 text-white/70 bg-white/5",
    success: "border-emerald-400/30 text-emerald-200 bg-emerald-500/10",
  } as const;
  return (
    <span className={`inline-block rounded-full px-2 py-0.5 border text-[11px] ${map[tone]}`}>
      {children}
    </span>
  );
}
