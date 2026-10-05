import { apiClient } from "@/shared/services/api-client";
import type { MentorDirectoryItem } from "../types/mentor-directory.types";

export async function getMentorDirectory(
  signal?: AbortSignal,
): Promise<MentorDirectoryItem[]> {
  const response = await apiClient.get<MentorDirectoryItem[]>("/mentors", {
    signal,
  });

  return response.data;
}
