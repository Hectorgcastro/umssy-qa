import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbItem } from "@/shared/types/breadcrumb.types";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Ruta de navegación">
      <ol className="flex flex-wrap items-center gap-1 text-xs text-text-secondary">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={item.label} className="flex items-center gap-1">
              {isLast ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {item.label}
                </span>
              ) : item.href ? (
                <Link href={item.href} className="hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span>{item.label}</span>
              )}
              {!isLast && (
                <ChevronRight aria-hidden="true" className="h-3 w-3" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
