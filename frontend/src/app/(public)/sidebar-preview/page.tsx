"use client";

import { Bell, House, User } from "lucide-react";
import { AppShell } from "@/shared/components/layout";
import type { NavigationItem } from "@/shared/types/navigation-item.types";

// Sample items for reference only: they show a simple item, the active item and
// a group with children. The real menu (SIDEBAR_NAVIGATION) stays empty, and
// the routes below are illustrative.
const EXAMPLE_NAVIGATION: NavigationItem[] = [
  { label: "Inicio", icon: House, href: "/sidebar-preview" },
  {
    label: "Mi perfil",
    icon: User,
    children: [
      { label: "Datos personales", href: "/profile/personal-info" },
      { label: "Trayectoria", href: "/profile/trajectory/education" },
      { label: "Documentos", href: "/profile/documents" },
    ],
  },
  { label: "Notificaciones", icon: Bell, href: "/notifications" },
];

// Temporary page to preview the shared sidebar template. Remove it once the
// sidebar is mounted in the real app layout.
export default function SidebarPreviewPage() {
  return (
    <AppShell items={EXAMPLE_NAVIGATION}>
      <h1 className="font-tight text-3xl font-extrabold text-ink">Vista previa del menú lateral</h1>
      <p className="mt-2 text-ink-soft">
        Este es un contenido de ejemplo. Usa el botón de la esquina superior izquierda para abrir
        o cerrar el menú.
      </p>
    </AppShell>
  );
}
