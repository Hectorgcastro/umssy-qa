import { apiClient } from "@/shared/services/api-client";

export type ActivateMentorPayload = {
  technicalAreaIds: string[];
  orientationTypeIds: string[];
};

export type ActivateMentorResponse = {
  id: string;
};

export async function activateMentor(
  payload: ActivateMentorPayload,
): Promise<ActivateMentorResponse> {
  const response = await apiClient.post<ActivateMentorResponse>(
    "/mentors/activate",
    payload,
  );

  return response.data;
}
