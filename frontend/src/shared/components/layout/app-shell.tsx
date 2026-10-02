"use client";

import type { CSSProperties } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { AppShellProps } from "@/shared/types/app-shell-props.types";
import { AppSidebar } from "./app-sidebar";
import { SidebarToggleButton } from "./sidebar-toggle-button";

// Wider than the shadcn default (16rem) so the brand text fits on one line.
const SIDEBAR_STYLE = { "--sidebar-width": "18rem" } as CSSProperties;

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
