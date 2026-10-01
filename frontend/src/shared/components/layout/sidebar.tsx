"use client";

import { usePathname } from "next/navigation";
import { SIDEBAR_NAVIGATION } from "@/shared/config/navigation.config";
import type { SidebarUser } from "@/shared/types/navigation.types";
import { SidebarBrand } from "./sidebar-brand";
import { SidebarNavItem } from "./sidebar-nav-item";
import { SidebarUserCard } from "./sidebar-user-card";

interface SidebarProps {
  user: SidebarUser;
  onNavigate?: () => void;
}

export function Sidebar({ user, onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-72 flex-col bg-ink">
      <SidebarBrand />

      <nav aria-label="Menú principal" className="flex-1 overflow-y-auto px-3">
        <ul className="flex flex-col gap-1">
          {SIDEBAR_NAVIGATION.map((item) => (
            <li key={item.label}>
              <SidebarNavItem item={item} pathname={pathname} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-3 py-4">
        <SidebarUserCard user={user} />
      </div>
    </aside>
  );
}
