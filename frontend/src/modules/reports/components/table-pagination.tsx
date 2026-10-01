import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const NAV_BUTTON_CLASSES =
  "flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink-soft transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40";

export function TablePagination({ currentPage, totalPages, onPageChange }: TablePaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Paginación" className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Página anterior"
        className={NAV_BUTTON_CLASSES}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
      </button>

      {pages.map((page) => {
        const isCurrent = page === currentPage;

        return (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={`Página ${page}`}
            className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold transition-colors ${
              isCurrent
                ? "bg-accent text-surface"
                : "border border-border bg-surface text-ink-soft hover:bg-surface-soft"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Página siguiente"
        className={NAV_BUTTON_CLASSES}
      >
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </nav>
  );
}
