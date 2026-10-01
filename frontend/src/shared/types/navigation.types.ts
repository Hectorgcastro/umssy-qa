import type { LucideIcon } from "lucide-react";

export interface NavigationChildItem {
  label: string;
  href: string;
}

export interface NavigationItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: NavigationChildItem[];
}

export interface SidebarUser {
  fullName: string;
  role: string;
  avatarUrl?: string;
}
