import type { ReactNode } from "react";
import { EventsAppShell } from "@/modules/events";

export default function EventsLayout({ children }: { children: ReactNode }) {
  return <EventsAppShell>{children}</EventsAppShell>;
}