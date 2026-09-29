import Link from "next/link";
import type { NavigationItem } from "../types/admin-navigation.types";

interface SidebarNavItemProps {
  item: NavigationItem;
  isActive: boolean;
}

export function SidebarNavItem({ item, isActive }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={`flex items-center gap-3 border-l-4 px-5 py-3 text-sm transition-colors ${
        isActive
          ? "border-accent bg-white/10 text-white"
          : "border-transparent text-white/80 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon aria-hidden="true" className="h-5 w-5 shrink-0" strokeWidth={1.5} />
      <span>{item.label}</span>
    </Link>
  );
}
