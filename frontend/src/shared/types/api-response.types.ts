export interface ApiResponse<T> {
  statusCode: number;
  ok: boolean;
  detail: string;
  data: T;
}
