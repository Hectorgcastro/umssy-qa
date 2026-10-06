"use client";

import type { ReactNode } from "react";
import { ClipboardList, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppShell } from "@/shared/components/layout";
import type { NavigationItem } from "@/shared/types/navigation-item.types";
import type { SidebarUser } from "@/shared/types/sidebar-user.types";
import { INBOX_PATH } from "../constants/request-review.constants";
import { useBackofficeSession } from "../hooks/use-backoffice-session";

const BACKOFFICE_NAVIGATION: NavigationItem[] = [{ label: "Solicitudes", icon: ClipboardList, href: INBOX_PATH }];

// TODO: mostrar el nombre real de la persona cuando el login lo devuelva
const BACKOFFICE_USER: SidebarUser = { fullName: "Personal administrativo", role: "Administrativo" };

export function BackofficeShell({ children }: { children: ReactNode }) {
  const { state, logout } = useBackofficeSession();

  if (state !== "allowed") return null;

  return (
    <AppShell items={BACKOFFICE_NAVIGATION} user={BACKOFFICE_USER}>
      <div className="flex justify-end pb-4">
        <Button variant="outline" size="sm" onClick={logout}>
          <LogOut aria-hidden="true" />
          Cerrar sesión
        </Button>
      </div>
      {children}
    </AppShell>
  );
}
