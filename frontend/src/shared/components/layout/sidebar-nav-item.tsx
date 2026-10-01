"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavigationItem } from "@/shared/types/navigation.types";

interface SidebarNavItemProps {
  item: NavigationItem;
  pathname: string;
  onNavigate?: () => void;
}

const BASE_ITEM_CLASSES =
  "relative flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-base transition-colors";
const ACTIVE_ITEM_CLASSES =
  "bg-surface/10 text-surface before:absolute before:inset-y-0 before:left-0 before:w-1 before:rounded-l-md before:bg-accent";
const IDLE_ITEM_CLASSES = "text-surface/80 hover:bg-surface/5 hover:text-surface";

function isRouteActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SidebarNavItem({ item, pathname, onNavigate }: SidebarNavItemProps) {
  const Icon = item.icon;
  const hasActiveChild = item.children?.some((child) => isRouteActive(pathname, child.href)) ?? false;
  const [isExpanded, setIsExpanded] = useState(hasActiveChild);

  if (!item.children) {
    const isActive = item.href ? isRouteActive(pathname, item.href) : false;

    return (
      <Link
        href={item.href ?? "#"}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={`${BASE_ITEM_CLASSES} ${isActive ? ACTIVE_ITEM_CLASSES : IDLE_ITEM_CLASSES}`}
      >
        <Icon className="h-6 w-6 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        <span>{item.label}</span>
      </Link>
    );
  }

  const submenuId = `submenu-${item.label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className={hasActiveChild ? "rounded-md bg-surface/5" : undefined}>
      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        aria-expanded={isExpanded}
        aria-controls={submenuId}
        className={`${BASE_ITEM_CLASSES} ${hasActiveChild ? ACTIVE_ITEM_CLASSES : IDLE_ITEM_CLASSES}`}
      >
        <Icon className="h-6 w-6 shrink-0" strokeWidth={1.5} aria-hidden="true" />
        <span className="flex-1">{item.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-accent transition-transform ${isExpanded ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isExpanded && (
        <ul id={submenuId} className="flex flex-col gap-1 py-2 pl-6 pr-2">
          {item.children.map((child) => {
            const isChildActive = isRouteActive(pathname, child.href);

            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  aria-current={isChildActive ? "page" : undefined}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isChildActive
                      ? "bg-surface/10 text-surface"
                      : "text-surface/70 hover:bg-surface/5 hover:text-surface"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${isChildActive ? "bg-accent" : "bg-surface/40"}`}
                    aria-hidden="true"
                  />
                  <span>{child.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
