"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { NavigationItem } from "../types/admin-navigation.types";

interface SidebarNavGroupProps {
  item: NavigationItem;
  pathname: string;
}

export function SidebarNavGroup({ item, pathname }: SidebarNavGroupProps) {
  const isGroupActive = pathname.startsWith(item.href);
  const [isOpen, setIsOpen] = useState(isGroupActive);
  const Icon = item.icon;
  const submenuId = `submenu-${item.href.replaceAll("/", "-")}`;

  return (
    <div>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={submenuId}
        onClick={() => setIsOpen((current) => !current)}
        className={`flex w-full items-center gap-3 border-l-4 px-5 py-3 text-left text-sm transition-colors ${
          isGroupActive
            ? "border-accent bg-white/10 text-white"
            : "border-transparent text-white/80 hover:bg-white/5 hover:text-white"
        }`}
      >
        <Icon aria-hidden="true" className="h-6 w-6 shrink-0" strokeWidth={1.5} />
        <span className="flex-1">{item.label}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 shrink-0 transition-transform ${
            isGroupActive ? "text-accent" : "text-white/60"
          } ${isOpen ? "" : "-rotate-90"}`}
        />
      </button>

      {isOpen && (
        <ul id={submenuId} className="space-y-1 py-2">
          {item.children?.map((child) => {
            const isChildActive = pathname === child.href;

            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  aria-current={isChildActive ? "page" : undefined}
                  className={`flex items-center gap-2 py-1.5 pl-8 pr-4 text-xs transition-colors ${
                    isChildActive
                      ? "bg-white/5 text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      isChildActive ? "bg-accent" : "bg-white/40"
                    }`}
                  />
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
