import { AdminLayoutView } from "@/modules/admin";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <AdminLayoutView>{children}</AdminLayoutView>;
}
