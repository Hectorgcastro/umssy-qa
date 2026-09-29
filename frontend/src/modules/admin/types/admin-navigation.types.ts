import type { LucideIcon } from "lucide-react";

export interface NavigationSubItem {
  label: string;
  href: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: NavigationSubItem[];
}
