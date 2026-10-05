import { apiClient } from "@/shared/services/api-client";
import type { TechnicalAreaResponse } from "@/modules/mentorship/types/technical-area-response.types";

export async function getMentorTechnicalAreas(
  signal?: AbortSignal,
): Promise<TechnicalAreaResponse[]> {
  const response = await apiClient.get<TechnicalAreaResponse[]>(
    "/mentors/me/technical-areas",
    { signal },
  );
  return response.data;
}

export async function updateMentorTechnicalAreas(
  technicalAreaIds: string[],
): Promise<void> {
  await apiClient.patch("/mentors/me/technical-areas", { technicalAreaIds });
}
