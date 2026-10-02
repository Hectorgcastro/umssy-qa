"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { SidebarNavItemProps } from "@/shared/types/sidebar-nav-item-props.types";
import { isRouteActive } from "@/shared/utils/is-route-active";

const ITEM_CLASS =
  "relative h-auto gap-3 px-4 py-3 text-base text-surface/80 hover:bg-surface/5 hover:text-surface active:bg-surface/10 active:text-surface data-active:bg-surface/10 data-active:font-normal data-active:text-surface data-active:before:absolute data-active:before:inset-y-0 data-active:before:left-0 data-active:before:w-1 data-active:before:rounded-l-md data-active:before:bg-accent [&_svg]:size-5";
const SUB_ITEM_CLASS =
  "h-auto gap-3 px-3 py-2 text-surface/70 hover:bg-surface/5 hover:text-surface active:bg-surface/10 active:text-surface data-active:bg-surface/10 data-active:text-surface";

export function SidebarNavItem({ item, pathname }: SidebarNavItemProps) {
  const Icon = item.icon;
  const submenuId = useId();
  const hasActiveChild = item.children?.some((child) => isRouteActive(pathname, child.href)) ?? false;
  const [isExpanded, setIsExpanded] = useState(hasActiveChild);

  if (!item.children) {
    const isActive = item.href ? isRouteActive(pathname, item.href) : false;

    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          render={<Link href={item.href ?? "#"} />}
          isActive={isActive}
          aria-current={isActive ? "page" : undefined}
          className={ITEM_CLASS}
        >
          <Icon strokeWidth={1.5} aria-hidden="true" />
          <span>{item.label}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem className={hasActiveChild ? "rounded-md bg-surface/5" : undefined}>
      <SidebarMenuButton
        isActive={hasActiveChild}
        aria-expanded={isExpanded}
        aria-controls={submenuId}
        onClick={() => setIsExpanded((previous) => !previous)}
        className={ITEM_CLASS}
      >
        <Icon strokeWidth={1.5} aria-hidden="true" />
        <span className="flex-1">{item.label}</span>
        <ChevronDown
          className={`text-accent transition-transform ${isExpanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </SidebarMenuButton>

      {isExpanded && (
        <SidebarMenuSub id={submenuId} className="mx-0 border-l-0 py-2 pl-6 pr-2">
          {item.children.map((child) => {
            const isChildActive = isRouteActive(pathname, child.href);

            return (
              <SidebarMenuSubItem key={child.href}>
                <SidebarMenuSubButton
                  render={<Link href={child.href} />}
                  isActive={isChildActive}
                  aria-current={isChildActive ? "page" : undefined}
                  className={SUB_ITEM_CLASS}
                >
                  <span
                    className={`size-1.5 shrink-0 rounded-full ${isChildActive ? "bg-accent" : "bg-surface/40"}`}
                    aria-hidden="true"
                  />
                  <span>{child.label}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
