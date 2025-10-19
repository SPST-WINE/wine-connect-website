"use client";

import { motion } from "framer-motion";
import {
  Package,
  ShoppingBasket,
  FileText,
  ArrowRight,
  Truck,
  Sparkles,
  Compass,
} from "lucide-react";
import React from "react";

/* ===================== PALETTE ===================== */
const WC_BLUE_SOFT = "#1c3e5e";
const WC_PINK = "#E33955";

/* ===================== TYPES ===================== */
type OrderRow = {
  id: string;
  type: "sample" | "order";
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  created_at: string;
  tracking_code: string | null;
};

export default function BuyerHomeClient(props: {
  userEmail: string;
  buyerName: string;
  companyName: string;
  country: string;
  complianceMode: "self" | "delegate_wc";
  recentOrders: OrderRow[];
}) {
  const {
    userEmail,
    buyerName,
    companyName,
    country,
    complianceMode,
    recentOrders,
  } = props;

  const greetingName =
    buyerName?.trim() ||
    companyName?.trim() ||
    (userEmail ? userEmail.split("@")[0] : "there");

  return (
    <section
      className="font-sans text-slate-100 selection:bg-[color:var(--wc)]/30"
      style={{
        ["--wc" as any]: WC_PINK,
      }}
    >
      {/* GLOWS */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.5, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-[620px] w-[620px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(60% 60% at 35% 35%, ${WC_PINK}55, transparent 60%)`,
        }}
      />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.35, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="pointer-events-none absolute -bottom-24 right-1/2 translate-x-1/2 h-[560px] w-[560px] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(60% 60% at 70% 70%, ${WC_BLUE_SOFT}66, transparent 60%)`,
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-5 py-8 space-y-8">
        {/* HERO DASHBOARD */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-white/70">
                Welcome
              </div>
              <h1 className="text-[28px] sm:text-[34px] font-black leading-[1.05]">
                Hi {greetingName} —
                <span
                  className="block text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(90deg, ${WC_PINK}, ${WC_BLUE_SOFT})`,
                  }}
                >
                  choose how you want to work today
                </span>
              </h1>
              <p className="mt-2 text-white/80 text-sm">
                {companyName ? `${companyName} · ` : ""}
                {country || "—"} · Compliance:{" "}
                {complianceMode === "self"
                  ? "Self-managed"
                  : "Handled by Wine Connect"}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <a
                href="/cart/samples"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-black/30 border border-white/10 hover:bg-white/5 text-sm"
              >
                <ShoppingBasket size={16} /> Sample cart
              </a>
              <a
                href="/profile"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-black/30 border border-white/10 hover:bg-white/5 text-sm"
              >
                <FileText size={16} /> Profile & compliance
              </a>
            </div>
          </div>

          {/* TWO PATHS */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tailored service */}
            <motion.a
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35 }}
              href="/brief"
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:bg-white/[0.06] transition"
            >
              <div className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-wider">
                <Sparkles size={16} />
                Tailored service
              </div>
              <h2 className="mt-1 text-xl md:text-2xl font-extrabold">
                Get a curated shortlist
              </h2>
              <p className="mt-2 text-white/75 text-sm">
                Give us your brief (styles, price points, volumes). We build
                the shortlist and ship a tasting kit.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                Start a brief{" "}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </motion.a>

            {/* Browse yourself */}
            <motion.a
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: 0.05 }}
              href="/catalog"
              className="group rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:bg-white/[0.06] transition"
            >
              <div className="flex items-center gap-2 text-white/80 text-xs uppercase tracking-wider">
                <Compass size={16} />
                Browse yourself
              </div>
              <h2 className="mt-1 text-xl md:text-2xl font-extrabold">
                Explore wines & add samples
              </h2>
              <p className="mt-2 text-white/75 text-sm">
                Filter by region, type, certifications and price. Add samples to
                cart and request shipment.
              </p>
              <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">
                Go to catalog{" "}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </div>
            </motion.a>
          </div>
        </section>

        {/* RECENT ORDERS */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] tracking-wider uppercase text-white/60">
                Recent activity
              </div>
              <h3 className="mt-1 text-xl md:text-2xl font-extrabold">
                Your latest orders
              </h3>
            </div>
            <a
              href="/orders"
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 bg-black/30 border border-white/10 hover:bg-white/5 text-sm"
            >
              <Package size={16} /> View all
            </a>
          </div>

          <ul className="mt-4 grid gap-3">
            {recentOrders.length === 0 && (
              <li className="rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/75">
                No orders yet. Start with a brief or add samples from the
                catalog.
              </li>
            )}

            {recentOrders.map((o) => (
              <li
                key={o.id}
                className="rounded-xl border border-white/10 bg-black/30 p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold truncate">
                      #{o.id.slice(0, 8)} · {o.type.toUpperCase()}
                    </div>
                    <div className="text-xs text-white/70 mt-0.5">
                      {new Date(o.created_at).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={o.status} />
                    {o.tracking_code ? (
                      <a
                        href={`/orders/${o.id}`}
                        className="inline-flex items-center gap-1 text-sm underline"
                      >
                        <Truck size={14} /> Track
                      </a>
                    ) : (
                      <a href={`/orders/${o.id}`} className="text-sm underline">
                        View details
                      </a>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: OrderRow["status"] }) {
  const map: Record<OrderRow["status"], string> = {
    pending: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
    processing: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    shipped: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    cancelled: "bg-red-500/15 text-red-300 border-red-500/30",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full border ${map[status]}`}>
      {status}
    </span>
  );
}
