import { User } from "lucide-react";
import type { NavigationItem } from "@/shared/types/navigation-item.types";

export const RADAR_PROFILE_PATH = "/perfil/radar";

export const RADAR_PROFILE_NAVIGATION: NavigationItem[] = [
  { label: "Mi Perfil", icon: User, href: RADAR_PROFILE_PATH },
];
