import type { NavigationItem } from "@/shared/types/navigation-item.types";
import { CalendarDays } from "lucide-react";

export const SIDEBAR_NAVIGATION: NavigationItem[] = [
  {
    label: "Mentorías",
    icon: CalendarDays,
    children: [
      { label: "Directorio de mentorías", href: "/mentorship/mentors" },
      { label: "Mi participación", href: "/mentors/participation" },
    ],
  },
];
