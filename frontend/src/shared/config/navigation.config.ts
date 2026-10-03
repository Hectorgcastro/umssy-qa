import { ChartColumn } from "lucide-react";
import type { NavigationItem } from "@/shared/types/navigation-item.types";

export const SIDEBAR_NAVIGATION: NavigationItem[] = [
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
