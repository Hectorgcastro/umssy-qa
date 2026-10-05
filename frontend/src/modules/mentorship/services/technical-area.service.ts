import { apiClient } from "@/shared/services/api-client";
import type { TechnicalAreaResponse } from "../types/technical-area-response.types";

export async function getTechnicalAreas(): Promise<TechnicalAreaResponse[]> {
  const response = await apiClient.get<TechnicalAreaResponse[]>(
    "/technical-areas",
  );
  return response.data;
}
