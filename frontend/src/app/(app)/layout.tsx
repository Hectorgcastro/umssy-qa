import { AppShell } from "@/shared/components/layout/app-shell";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}