import type { LucideIcon } from "lucide-react";
import type { NavigationChildItem } from "./navigation-child-item.types";

export interface NavigationItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: NavigationChildItem[];
}
