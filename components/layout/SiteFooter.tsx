export default function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-white/10 bg-[rgba(10,12,20,0.65)] text-white/80">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="text-sm">
            © {new Date().getFullYear()} Wine Connect — All rights reserved.
          </div>
          <div className="text-sm opacity-90">
            Logistics powered by <span className="font-semibold text-white">SPST</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
