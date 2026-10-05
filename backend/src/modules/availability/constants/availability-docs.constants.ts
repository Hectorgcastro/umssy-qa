export const CREATE_BLOCK_DOCS = {
  summary: 'Crea un bloque de disponibilidad del mentor en sesión y lo devuelve como libre (201, guardado en UTC)',
} as const;

export const FIND_MY_BLOCKS_DOCS = {
  summary: 'Lista los bloques de disponibilidad del mentor en sesión dentro de un rango de hasta 7 días',
  fromDescription: 'Inicio del rango en ISO 8601 UTC (por ejemplo, lunes 00:00 de Bolivia = 04:00Z)',
  toDescription: 'Fin del rango en ISO 8601 UTC; como máximo 7 días después de from',
} as const;

export const DELETE_BLOCK_DOCS = {
  summary: 'Elimina un bloque de disponibilidad del mentor en sesión',
  description: 'Borra el bloque; si tiene citas activas asociadas responde con 409',
  idDescription: 'UUID del bloque a eliminar',
} as const;
