import type { ReactNode } from "react";
import { AdminSidebar } from "../components/admin-sidebar";

interface AdminLayoutViewProps {
  children: ReactNode;
}

export function AdminLayoutView({ children }: AdminLayoutViewProps) {
  return (
    <div className="flex h-screen bg-surface-soft">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
