import { apiClient } from "@/shared/services/api-client";
import type { OrientationType } from "../types/orientation-type.types";

export async function getOrientationTypes(): Promise<OrientationType[]> {
  const response = await apiClient.get<OrientationType[]>("/orientation-types");
  return response.data;
}
