"use client";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

// Replaces SidebarTrigger because the generated one has a fixed icon and an
// English label, and files in components/ui are not edited.
export function SidebarToggleButton() {
  const { open, toggleSidebar } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      aria-label={open ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={open}
      className="rounded-md p-2 text-ink transition-colors hover:bg-ink/5"
    >
      <Menu className="size-6" aria-hidden="true" />
    </button>
  );
}
