export type PaginationItem = number | "ellipsis-start" | "ellipsis-end";

// Con más páginas que este máximo se muestran la primera, la última, las vecinas de la
// actual y "..." en los saltos, para que el paginador no crezca sin límite.
const MAX_VISIBLE_ITEMS = 7;
const EDGE_BLOCK_SIZE = 5;

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export function getPaginationItems(currentPage: number, totalPages: number): PaginationItem[] {
  if (totalPages <= MAX_VISIBLE_ITEMS) {
    return range(1, totalPages);
  }

  if (currentPage < EDGE_BLOCK_SIZE) {
    return [...range(1, EDGE_BLOCK_SIZE), "ellipsis-end", totalPages];
  }

  if (currentPage > totalPages - EDGE_BLOCK_SIZE + 1) {
    return [1, "ellipsis-start", ...range(totalPages - EDGE_BLOCK_SIZE + 1, totalPages)];
  }

  return [1, "ellipsis-start", currentPage - 1, currentPage, currentPage + 1, "ellipsis-end", totalPages];
}
