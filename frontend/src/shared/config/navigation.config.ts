import type { NavigationItem } from "@/shared/types/navigation-item.types";

// Shared sidebar navigation for the whole app. It starts empty on purpose so
// every epic adapts the same template instead of building its own sidebar.
//
// How each group adds its items:
// 1. Import the icon from "lucide-react" (no emojis or decorative characters).
// 2. Append an object to SIDEBAR_NAVIGATION. Labels are shown to the user, so
//    they are written in Spanish:
//    - Simple item:
//      { label: "Inicio", icon: House, href: "/home" }
//    - Item with children (renders an expandable group):
//      {
//        label: "Mi perfil",
//        icon: User,
//        children: [{ label: "Datos personales", href: "/profile/personal-info" }],
//      }
// 3. Only add or edit the entries owned by your group, and coordinate the
//    order with the other groups to avoid merge conflicts.
//
// A view can also pass its own list with <AppShell items={...} />, which
// overrides this default.
export const SIDEBAR_NAVIGATION: NavigationItem[] = [];
