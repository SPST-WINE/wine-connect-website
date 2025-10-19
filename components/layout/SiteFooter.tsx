export default function SiteFooter() {
  return (
    <footer
      className="
        mt-16 w-full
        border-t border-white/10
        bg-[#0a1722]/70
        text-white/80
        backdrop-blur supports-[backdrop-filter]:bg-[#0a1722]/55
      "
    >
      {/* full-bleed row: elementi ai bordi */}
      <div className="flex w-full items-center justify-between px-4 md:px-6 py-8">
        {/* SINISTRA: copyright vicino al bordo */}
        <div className="text-sm -ml-1 md:-ml-2">
          © {new Date().getFullYear()} Wine Connect — All rights reserved.
        </div>

        {/* DESTRA: payoff vicino al bordo */}
        <div className="text-sm opacity-90 -mr-1 md:-mr-2">
          Logistics powered by <span className="font-semibold text-white">SPST</span>
        </div>
      </div>
    </footer>
  );
}
