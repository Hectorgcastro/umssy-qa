"use client";

import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import type { SidebarUser } from "@/shared/types/navigation.types";
import { Sidebar } from "./sidebar";

interface ShellProps {
  user: SidebarUser;
  children: ReactNode;
}

export function Shell({ user, children }: ShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-surface-soft">
      <div className="sticky top-0 hidden h-screen lg:block">
        <Sidebar user={user} />
      </div>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="relative h-full">
            <Sidebar user={user} onNavigate={closeMobileMenu} />
            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Cerrar menú"
              className="absolute right-3 top-3 rounded-md p-1 text-surface/80 hover:text-surface"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Cerrar menú"
            className="flex-1 bg-ink/50"
          />
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center gap-3 border-b border-border bg-ink px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Abrir menú"
            className="rounded-md p-1 text-surface"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <span className="font-tight text-lg font-extrabold text-surface">UMSSY</span>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
