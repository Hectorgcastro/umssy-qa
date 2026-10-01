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
