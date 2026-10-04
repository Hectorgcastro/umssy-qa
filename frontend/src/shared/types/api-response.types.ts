// Contrato estandarizado de respuesta del backend (sección 1.8 del manual).
export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  offset?: number;
  page?: number;
  detail: string;
  ok: boolean;
}

export interface PaginatedData<T> {
  items: T[];
  totalItems: number;
}
