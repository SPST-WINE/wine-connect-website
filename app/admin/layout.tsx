// app/admin/layout.tsx
export const dynamic = "force-dynamic";

import type { ReactNode } from "react";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminFooter from "@/components/admin/AdminFooter";

const BG =
  "radial-gradient(120% 120% at 50% -10%, #1c3e5e 0%, #0a1722 60%, #000 140%)";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col text-white" style={{ background: BG }}>
      <AdminHeader />
      {/* Le pagine renderizzano solo il loro <main> */}
      {children}
      <AdminFooter />
    </div>
  );
}
