import type { ReactNode } from "react";

export interface ReportTableColumn<TRow> {
  header: string;
  render: (row: TRow) => ReactNode;
  isNoWrap?: boolean;
}

interface ReportTableProps<TRow> {
  columns: ReportTableColumn<TRow>[];
  rows: TRow[];
  getRowKey: (row: TRow) => string;
  isLoading: boolean;
  hasError: boolean;
  emptyMessage: string;
}

const SKELETON_ROW_COUNT = 5;
const ERROR_MESSAGE =
  "No se pudo cargar el reporte. Presiona Actualizar para intentarlo de nuevo.";

export function ReportTable<TRow>({
  columns,
  rows,
  getRowKey,
  isLoading,
  hasError,
  emptyMessage,
}: ReportTableProps<TRow>) {
  function renderMessageRow(message: string, isError = false) {
    return (
      <tr>
        <td
          colSpan={columns.length}
          role={isError ? "alert" : undefined}
          className={`px-4 py-12 text-center ${
            isError ? "text-danger" : "text-text-secondary"
          }`}
        >
          {message}
        </td>
      </tr>
    );
  }

  function renderBody() {
    if (isLoading) {
      return Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <tr key={index} aria-hidden="true" className="border-t border-border">
          {columns.map((column) => (
            <td key={column.header} className="px-4 py-3.5">
              <span className="block h-4 w-3/4 animate-pulse rounded bg-surface-soft" />
            </td>
          ))}
        </tr>
      ));
    }

    if (hasError) {
      return renderMessageRow(ERROR_MESSAGE, true);
    }

    if (rows.length === 0) {
      return renderMessageRow(emptyMessage);
    }

    return rows.map((row) => (
      <tr
        key={getRowKey(row)}
        className="border-t border-border transition-colors hover:bg-surface-soft/60"
      >
        {columns.map((column) => (
          <td
            key={column.header}
            className={`px-4 py-3 text-ink ${column.isNoWrap ? "whitespace-nowrap" : ""}`}
          >
            {column.render(row)}
          </td>
        ))}
      </tr>
    ));
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-sm">
      <table aria-busy={isLoading} className="w-full text-left text-sm">
        <thead className="bg-surface-soft">
          <tr>
            {columns.map((column) => (
              <th
                key={column.header}
                scope="col"
                className="whitespace-nowrap px-4 py-3 font-semibold text-ink"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderBody()}</tbody>
      </table>
    </div>
  );
}
