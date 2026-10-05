import { apiClient } from "@/shared/services/api-client";
import type { OrientationTypeResponse } from "../types/orientation-type-response.types";

export async function getOrientationTypes(): Promise<
  OrientationTypeResponse[]
> {
  const response = await apiClient.get<OrientationTypeResponse[]>(
    "/orientation-types",
  );
  return response.data;
}
