import { apiClient } from "@/shared/services/api-client";
import type { TechnicalArea } from "../types/technical-area.types";

export async function getTechnicalAreas(
  signal?: AbortSignal,
): Promise<TechnicalArea[]> {
  const response = await apiClient.get<TechnicalArea[]>("/technical-areas", {
    signal,
  });
  return response.data;
}

export async function getMentorTechnicalAreas(
  signal?: AbortSignal,
): Promise<TechnicalArea[]> {
  const response = await apiClient.get<TechnicalArea[]>(
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
