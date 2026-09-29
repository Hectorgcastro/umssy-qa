import { History, House, Inbox } from "lucide-react";
import { ChartBarsIcon } from "../components/chart-bars-icon";
import type { NavigationItem } from "../types/admin-navigation.types";

export const ADMIN_NAVIGATION: NavigationItem[] = [
  { label: "Inicio", href: "/admin", icon: House },
  { label: "Solicitudes", href: "/admin/requests", icon: Inbox },
  { label: "Registro de auditoría", href: "/admin/audit-log", icon: History },
  {
    label: "Reportes Analíticos",
    href: "/admin/reports",
    icon: ChartBarsIcon,
    children: [
      {
        label: "Reporte de usuarios registrados",
        href: "/admin/reports/registered-users",
      },
      {
        label: "Reporte de usuarios rechazados",
        href: "/admin/reports/rejected-users",
      },
      {
        label: "Historial de reportes generados",
        href: "/admin/reports/history",
      },
    ],
  },
];
