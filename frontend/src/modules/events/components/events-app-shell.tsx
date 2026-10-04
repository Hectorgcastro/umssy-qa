"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { CalendarDays, Ticket } from "lucide-react";
import { AppShell } from "@/shared/components/layout";
import type { NavigationItem } from "@/shared/types/navigation-item.types";

const EVENTS_NAVIGATION: NavigationItem[] = [
  { label: "Talleres", icon: CalendarDays, href: "/events" },
  { label: "Mis pases", icon: Ticket, href: "/events/my-passes" },
];

export function EventsAppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return <AppShell items={EVENTS_NAVIGATION} fullBleed={pathname === "/events"}>{children}</AppShell>;
}
