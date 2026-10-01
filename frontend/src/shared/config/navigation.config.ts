import { ChartColumn, History, House, Inbox } from "lucide-react";
import type { NavigationItem } from "@/shared/types/navigation.types";

export const SIDEBAR_NAVIGATION: NavigationItem[] = [
  { label: "Inicio", icon: House, href: "/dashboard" },
  { label: "Solicitudes", icon: Inbox, href: "/requests" },
  { label: "Registro de auditoría", icon: History, href: "/audit-log" },
  {
    label: "Reportes Analíticos",
    icon: ChartColumn,
    children: [
      { label: "Reporte de usuarios registrados", href: "/reports/registered-users" },
      { label: "Reporte de usuarios rechazados", href: "/reports/rejected-users" },
      { label: "Historial de reportes generados", href: "/reports/history" },
    ],
  },
];
