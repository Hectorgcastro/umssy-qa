import type { SidebarUser } from "@/shared/types/sidebar-user.types";

// Temporary user shown in the sidebar footer. Replace it with the
// authenticated user once the auth module is available.
export const TEMPORARY_SIDEBAR_USER: SidebarUser = {
  fullName: "Alejandro Vargas",
  role: "Administrador",
};
