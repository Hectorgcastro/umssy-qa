"use client";

import type { ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { AppShell } from "@/shared/components/layout";
import type { NavigationItem } from "@/shared/types/navigation-item.types";

const EVENTS_NAVIGATION: NavigationItem[] = [
  { label: "Talleres", icon: CalendarDays, href: "/events" },
];

export function EventsAppShell({ children }: { children: ReactNode }) {
  return <AppShell items={EVENTS_NAVIGATION}>{children}</AppShell>;
}
