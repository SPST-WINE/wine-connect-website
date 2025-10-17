// components/common/Pagination.tsx
import Link from "next/link";

export default function Pagination({
  pages,
  page,
  searchParams,
}: {
  pages: number;
  page: number;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (pages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
        const params = new URLSearchParams({
          ...Object.fromEntries(
            Object.entries(searchParams).map(([k, v]) => [k, String(v ?? "")])
          ),
          page: String(p),
        });
        return (
          <Link
            key={p}
            href={`?${params.toString()}`}
            className={`min-w-[2.25rem] h-9 grid place-items-center rounded-lg border ${
              p === page
                ? "border-white/20 bg-white/10 text-white"
                : "border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/[0.06]"
            } text-sm`}
          >
            {p}
          </Link>
        );
      })}
    </div>
  );
}
