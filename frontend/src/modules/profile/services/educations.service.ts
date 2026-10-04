import { apiClient } from "@/shared/services/api-client";
import { EDUCATIONS_ENDPOINT } from "../config/education-api.config";
import type { ApiResponse } from "../types/api-response.types";
import type { EducationItem } from "../types/education-item.types";

export const educationsService = {
  getEducations: async (): Promise<EducationItem[]> => {
    const accessToken = sessionStorage.getItem("accessToken");
    const response = await apiClient.get<ApiResponse<EducationItem[]>>(EDUCATIONS_ENDPOINT, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    });
    return response.data.data;
  },
};
