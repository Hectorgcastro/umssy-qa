import { apiClient } from "@/shared/services/api-client";
import type { TechnicalAreaResponse } from "../types/technical-area-response.types";

export async function getTechnicalAreas(
  signal?: AbortSignal,
): Promise<TechnicalAreaResponse[]> {
  const response = await apiClient.get<TechnicalAreaResponse[]>(
    "/technical-areas",
    { signal },
  );
  return response.data;
}
