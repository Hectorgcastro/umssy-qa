import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PAGE_BUTTON_CLASSES =
  "size-9 rounded-md border-border bg-surface text-sm font-semibold text-ink-soft hover:bg-surface-soft hover:text-ink";
const CURRENT_PAGE_CLASSES =
  "size-9 rounded-md border-transparent bg-accent text-sm font-semibold text-surface hover:bg-accent";
const NAV_BUTTON_CLASSES = `${PAGE_BUTTON_CLASSES} disabled:cursor-not-allowed disabled:opacity-40`;

// Usa la estructura de Pagination de shadcn con botones: el cambio de página ocurre en la misma vista.
export function TablePagination({ currentPage, totalPages, onPageChange }: TablePaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <Pagination aria-label="Paginación" className="mx-0 w-auto">
      <PaginationContent className="gap-2">
        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Página anterior"
            className={NAV_BUTTON_CLASSES}
            suppressHydrationWarning
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </Button>
        </PaginationItem>

        {pages.map((page) => {
          const isCurrent = page === currentPage;

          return (
            <PaginationItem key={page}>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => onPageChange(page)}
                aria-current={isCurrent ? "page" : undefined}
                aria-label={`Página ${page}`}
                className={isCurrent ? CURRENT_PAGE_CLASSES : PAGE_BUTTON_CLASSES}
                suppressHydrationWarning
              >
                {page}
              </Button>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Página siguiente"
            className={NAV_BUTTON_CLASSES}
            suppressHydrationWarning
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
