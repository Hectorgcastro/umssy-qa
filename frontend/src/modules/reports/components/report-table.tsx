interface ReportTableProps {
  columns: string[];
  emptyMessage: string;
}

export function ReportTable({ columns, emptyMessage }: ReportTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-soft">
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="whitespace-nowrap px-4 py-3 font-semibold text-ink"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              colSpan={columns.length}
              className="px-4 py-12 text-center text-text-secondary"
            >
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
