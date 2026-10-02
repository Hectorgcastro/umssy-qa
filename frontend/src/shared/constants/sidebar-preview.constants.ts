import { Bell, House, User } from "lucide-react";
import type { NavigationItem } from "@/shared/types/navigation-item.types";

export const SIDEBAR_PREVIEW_NAVIGATION: NavigationItem[] = [
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
