export const FIND_MY_BLOCKS_DOCS = {
  summary: 'Lista los bloques de disponibilidad del mentor en sesión dentro de un rango de hasta 7 días',
  fromDescription: 'Inicio del rango en ISO 8601 UTC (por ejemplo, lunes 00:00 de Bolivia = 04:00Z)',
  toDescription: 'Fin del rango en ISO 8601 UTC; como máximo 7 días después de from',
} as const;

export const UPDATE_BLOCK_DOCS = {
  summary: 'Edita un bloque de disponibilidad propio que no tenga citas pendientes o confirmadas',
  idDescription: 'ID del bloque de disponibilidad a editar',
} as const;
