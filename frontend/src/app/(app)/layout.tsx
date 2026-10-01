import type { ReactNode } from "react";
import { Shell } from "@/shared/components/layout";
import type { SidebarUser } from "@/shared/types/navigation.types";

// Usuario temporal hasta que exista AuthContext (sección 3.1 del manual).
const TEMPORARY_USER: SidebarUser = {
  fullName: "Alejandro Vargas",
  role: "Administrador",
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return <Shell user={TEMPORARY_USER}>{children}</Shell>;
}
