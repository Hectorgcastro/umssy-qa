"use client";

import { AppShell } from "@/shared/components/layout";
import { SIDEBAR_PREVIEW_NAVIGATION } from "@/shared/constants/sidebar-preview.constants";

export default function SidebarPreviewPage() {
  return (
    <AppShell items={SIDEBAR_PREVIEW_NAVIGATION}>
      <h1 className="font-tight text-3xl font-extrabold text-ink">Vista previa del menú lateral</h1>
      <p className="mt-2 text-ink-soft">
        Este es un contenido de ejemplo. Usa el botón de la esquina superior izquierda para abrir
        o cerrar el menú.
      </p>
    </AppShell>
  );
}
