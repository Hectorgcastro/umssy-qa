import { FileSearchCorner } from "lucide-react";

const SKELETON_ROWS = 5;

interface TableSkeletonRowsProps {
  columnCount: number;
}

export function TableSkeletonRows({ columnCount }: TableSkeletonRowsProps) {
  return Array.from({ length: SKELETON_ROWS }, (_, index) => (
    <tr key={index} data-testid="skeleton-row" className="border-t border-border">
      {Array.from({ length: columnCount }, (_, cellIndex) => (
        <td key={cellIndex} className="px-6 py-4">
          <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
        </td>
      ))}
    </tr>
  ));
}

interface TableMessageRowProps {
  columnCount: number;
  message: string;
}

export function TableMessageRow({ columnCount, message }: TableMessageRowProps) {
  return (
    <tr>
      <td colSpan={columnCount} className="px-6 py-10 text-center text-text-secondary">
        {message}
      </td>
    </tr>
  );
}

// Estado vacío con ícono para cuando una búsqueda no encuentra resultados.
export function TableNoResultsRow({ columnCount, message }: TableMessageRowProps) {
  return (
    <tr>
      <td colSpan={columnCount} className="px-6 py-16">
        <div role="status" className="mx-auto flex max-w-56 flex-col items-center gap-4 text-center">
          <FileSearchCorner className="h-14 w-14 text-ink-soft" strokeWidth={1.25} aria-hidden="true" />
          <p className="text-base font-medium text-ink">{message}</p>
        </div>
      </td>
    </tr>
  );
}
