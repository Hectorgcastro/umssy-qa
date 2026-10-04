const MAX_SEGMENT_LENGTH = 50;
const FILE_NAME_SEPARATOR = '-';

// Convierte texto libre en un fragmento seguro para el nombre de un archivo:
// "Juan Pérez" -> "juan-perez". Conserva "@" y "." para que los correos se lean igual.
export function toFileNameSegment(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9@._]+/g, FILE_NAME_SEPARATOR)
    .slice(0, MAX_SEGMENT_LENGTH)
    .replace(/^[-.]+|[-.]+$/g, '');
}

// Une el prefijo del reporte, los filtros usados y la fecha: "usuarios-registrados-estudiante-2026-10-04.csv".
export function buildExportFileName(
  prefix: string,
  filters: readonly (string | undefined)[],
  date: string,
  extension: string,
): string {
  const filterSegments = filters
    .map((filter) => (filter ? toFileNameSegment(filter) : ''))
    .filter((segment) => segment.length > 0);

  return `${[prefix, ...filterSegments, date].join(FILE_NAME_SEPARATOR)}.${extension}`;
}
