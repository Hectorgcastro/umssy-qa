import type { LucideIcon } from "lucide-react";
import type { NavigationChildItem } from "./navigation-child-item.types";

// An item is either a simple link (href) or a group that expands its children.
export interface NavigationItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  children?: NavigationChildItem[];
}
