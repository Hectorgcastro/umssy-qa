"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SIDEBAR_STYLE } from "@/shared/constants/sidebar.constants";
import type { AppShellProps } from "@/shared/types/app-shell-props.types";
import { AppSidebar } from "./app-sidebar";
import { SidebarToggleButton } from "./sidebar-toggle-button";

export function AppShell({ children, items, user }: AppShellProps) {
  return (
    <SidebarProvider style={SIDEBAR_STYLE}>
      <AppSidebar items={items} user={user} />
      <SidebarInset className="bg-surface-soft">
        <header className="flex items-center px-4 py-3">
          <SidebarToggleButton />
        </header>
        <div className="flex-1 px-8 pb-8">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
