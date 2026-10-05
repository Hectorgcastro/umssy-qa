import { Briefcase } from "lucide-react";
import type { NavigationItem } from "@/shared/types/navigation-item.types";

export const SIDEBAR_NAVIGATION: NavigationItem[] = [
    {
        label: "Vacantes", icon: Briefcase, href: "/vacancies/register",
    },
];
