"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SidebarUser } from "@/shared/types/sidebar-user.types";
import { getInitials } from "@/shared/utils/get-initials";

interface BackofficeUserFooterProps {
  user: SidebarUser;
  onLogout: () => void;
}

export function BackofficeUserFooter({ user, onLogout }: BackofficeUserFooterProps) {
  return (
    <div className="flex items-center gap-3 border-t border-surface/10 pt-4">
      <span
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface/15 text-sm font-bold text-surface"
        aria-hidden="true"
      >
        {getInitials(user.fullName)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-semibold text-surface">{user.fullName}</span>
        <span className="truncate text-xs text-surface/70">{user.role}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Cerrar sesión"
        onClick={onLogout}
        className="text-surface/80 hover:bg-surface/10 hover:text-surface"
      >
        <LogOut strokeWidth={1.75} aria-hidden="true" />
      </Button>
    </div>
  );
}
