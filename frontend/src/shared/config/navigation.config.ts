import { Dot } from "lucide-react";
import type { NavigationItem } from "@/shared/types/navigation-item.types";

export const SIDEBAR_NAVIGATION: NavigationItem[] = [
  { label: "Inicio", icon: Dot, href: "/" },
  { label: "Mis vacantes", icon: Dot, href: "#" },
  { label: "Registrar nueva vacante", icon: Dot, href: "/vacancies/register" },
  { label: "Perfil de empresa", icon: Dot, href: "#" },
];