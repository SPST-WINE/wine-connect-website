// components/marketing/StatsStrip.tsx
export default function StatsStrip() {
  const stats = [
    { k: "Wineries", v: "50+" },
    { k: "Labels", v: "300+" },
    { k: "Markets", v: "EU · UK · US · HK" },
    { k: "Avg. lead time", v: "7–12 days" },
  ];
  return (
    <section className="py-8">
      <div className="mx-auto max-w-6xl px-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="rounded-2xl border p-5">
            <div className="text-2xl font-semibold">{s.v}</div>
            <div className="text-sm text-zinc-500">{s.k}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
