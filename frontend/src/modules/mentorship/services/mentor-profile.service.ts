import { isAxiosError } from "axios";
import { apiClient } from "@/shared/services/api-client";
import type { MentorProfile } from "../types/mentor-profile.types";

export async function getMentorProfile(
  mentorId: string,
  signal?: AbortSignal,
): Promise<MentorProfile | null> {
  try {
    const response = await apiClient.get<MentorProfile>(
      `/mentors/${mentorId}`,
      { signal },
    );

    return response.data;
  } catch (error) {
    const status = isAxiosError(error) ? error.response?.status : undefined;

    if (status === 400 || status === 404) {
      return null;
    }

    throw error;
  }
}
