export default function AdminFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-black/20">
      <div className="px-5 py-6 flex items-center justify-between text-xs text-white/70">
        <small>© {new Date().getFullYear()} Wine Connect — Admin</small>
        <small>
          Logistics powered by <span className="font-semibold text-white">SPST</span>
        </small>
      </div>
    </footer>
  );
}
