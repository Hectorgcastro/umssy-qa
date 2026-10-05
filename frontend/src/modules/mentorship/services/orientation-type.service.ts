import { apiClient } from "@/shared/services/api-client";
import type { OrientationTypeResponse } from "../types/orientation-type-response.types";

export async function getOrientationTypes(
  signal?: AbortSignal,
): Promise<OrientationTypeResponse[]> {
  const response = await apiClient.get<OrientationTypeResponse[]>(
    "/orientation-types",
    { signal },
  );
  return response.data;
}

export async function getMentorOrientationTypes(
  signal?: AbortSignal,
): Promise<OrientationTypeResponse[]> {
  const response = await apiClient.get<OrientationTypeResponse[]>(
    "/mentors/me/orientation-types",
    { signal },
  );
  return response.data;
}

export async function updateMentorOrientationTypes(
  orientationTypeIds: string[],
): Promise<void> {
  await apiClient.patch("/mentors/me/orientation-types", {
    orientationTypeIds,
  });
}
