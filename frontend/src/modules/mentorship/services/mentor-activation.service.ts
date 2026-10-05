import { apiClient } from "@/shared/services/api-client";
import type { ActivateMentorPayload } from "../types/activate-mentor-payload.types";
import type { ActivateMentorResponse } from "../types/activate-mentor-response.types";

export async function activateMentor(
  payload: ActivateMentorPayload,
): Promise<ActivateMentorResponse> {
  const response = await apiClient.post<ActivateMentorResponse>(
    "/mentors/activate",
    payload,
  );

  return response.data;
}
