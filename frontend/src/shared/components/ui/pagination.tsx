import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  itemLabel: string;
  onPageChange: (page: number) => void;
}

const ARROW_BUTTON_CLASS =
  "flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface text-ink-soft transition-colors hover:bg-surface-soft disabled:cursor-not-allowed disabled:opacity-40";

export function Pagination({
  page,
  limit,
  total,
  itemLabel,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const firstItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const lastItem = Math.min(page * limit, total);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav
      aria-label="Paginación"
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <p className="text-sm text-text-secondary">
        Mostrando {firstItem}-{lastItem} de {total} {itemLabel}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Página anterior"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className={ARROW_BUTTON_CLASS}
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4" />
        </button>

        {pages.map((pageNumber) => {
          const isCurrentPage = pageNumber === page;

          return (
            <button
              key={pageNumber}
              type="button"
              aria-label={`Página ${pageNumber}`}
              aria-current={isCurrentPage ? "page" : undefined}
              onClick={() => onPageChange(pageNumber)}
              className={`h-8 min-w-8 rounded-md px-2 text-sm font-semibold transition-colors ${
                isCurrentPage
                  ? "bg-accent text-white"
                  : "border border-border bg-surface text-ink hover:bg-surface-soft"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          type="button"
          aria-label="Página siguiente"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className={ARROW_BUTTON_CLASS}
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
}
