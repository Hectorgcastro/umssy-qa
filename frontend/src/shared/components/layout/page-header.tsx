import { Breadcrumb } from "@/shared/components/ui/breadcrumb";
import type { BreadcrumbItem } from "@/shared/types/breadcrumb.types";

interface PageHeaderProps {
  title: string;
  breadcrumbItems: BreadcrumbItem[];
}

export function PageHeader({ title, breadcrumbItems }: PageHeaderProps) {
  return (
    <header className="space-y-2">
      <Breadcrumb items={breadcrumbItems} />
      <h1 className="font-tight text-3xl font-extrabold text-ink">{title}</h1>
    </header>
  );
}
