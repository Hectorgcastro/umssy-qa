"use client";

import { usePathname } from "next/navigation";
import { ADMIN_NAVIGATION } from "../constants/admin-navigation";
import { BrandLogo } from "./brand-logo";
import { SidebarNavGroup } from "./sidebar-nav-group";
import { SidebarNavItem } from "./sidebar-nav-item";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-ink">
      <div className="px-5 py-6">
        <BrandLogo />
      </div>

      <nav aria-label="Menú principal" className="flex-1 overflow-y-auto">
        {ADMIN_NAVIGATION.map((item) =>
          item.children ? (
            <SidebarNavGroup key={item.href} item={item} pathname={pathname} />
          ) : (
            <SidebarNavItem
              key={item.href}
              item={item}
              isActive={pathname === item.href}
            />
          ),
        )}
      </nav>
    </aside>
  );
}
