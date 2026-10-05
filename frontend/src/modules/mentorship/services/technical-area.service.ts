import { apiClient } from "@/shared/services/api-client";
import type { TechnicalArea } from "../types/technical-area.types";

export async function getTechnicalAreas(): Promise<TechnicalArea[]> {
  const response = await apiClient.get<TechnicalArea[]>("/technical-areas");
  return response.data;
}
