import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function TablePagination({ currentPage, totalPages, onPageChange }: TablePaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Paginación" className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Página anterior"
        className={NAV_BUTTON_CLASSES}
      >
        <ChevronLeft className="size-4" aria-hidden="true" />
      </Button>

      {pages.map((page) => {
        const isCurrent = page === currentPage;

        return (
          <Button
            key={page}
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onPageChange(page)}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={`Página ${page}`}
            className={isCurrent ? CURRENT_PAGE_CLASSES : PAGE_BUTTON_CLASSES}
          >
            {page}
          </Button>
        );
      })}

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Página siguiente"
        className={NAV_BUTTON_CLASSES}
      >
        <ChevronRight className="size-4" aria-hidden="true" />
      </Button>
    </nav>
  );
}
