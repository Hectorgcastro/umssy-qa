import type { ReactNode } from "react";
import { Sidebar } from "./sidebar";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-surface-soft md:flex-row">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col" id="main-content">
        {children}
      </main>
    </div>
  );
}
