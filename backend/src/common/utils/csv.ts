// Marca de orden de bytes: permite que Excel abra el archivo como UTF-8 (tildes y ñ).
export const CSV_BOM = '﻿';

const CSV_SEPARATOR = ',';
const CSV_LINE_BREAK = '\r\n';

// Caracteres con los que Excel interpreta una celda como fórmula.
const FORMULA_PREFIXES = ['=', '+', '-', '@', '\t', '\r'];

function escapeCsvValue(value: string): string {
  const safeValue = FORMULA_PREFIXES.some((prefix) => value.startsWith(prefix))
    ? `'${value}`
    : value;

  if (/[",\r\n]/.test(safeValue)) {
    return `"${safeValue.replace(/"/g, '""')}"`;
  }

  return safeValue;
}

export function buildCsv(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
): string {
  const lines = [headers, ...rows].map((row) =>
    row.map(escapeCsvValue).join(CSV_SEPARATOR),
  );

  return CSV_BOM + lines.join(CSV_LINE_BREAK) + CSV_LINE_BREAK;
}
