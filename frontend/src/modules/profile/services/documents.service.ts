import { apiClient } from "@/shared/services/api-client";
import { CV_ENDPOINT, CV_UPLOAD_FIELD_NAME } from "../config/cv-api.config";
import type { ApiResponse } from "../types/api-response.types";
import type { CvResponse } from "../types/cv-response.types";
import type { SavedCv } from "../types/saved-cv.types";
import { toSavedCv } from "../utils/to-saved-cv";

export const documentsService = {
  getCv: async (): Promise<SavedCv | null> => {
    const response = await apiClient.get<ApiResponse<CvResponse | null>>(CV_ENDPOINT);
    const cv = response.data.data;
    return cv ? toSavedCv(cv) : null;
  },

  uploadCv: async (file: File): Promise<SavedCv> => {
    const formData = new FormData();
    formData.append(CV_UPLOAD_FIELD_NAME, file);
    const response = await apiClient.put<ApiResponse<CvResponse>>(CV_ENDPOINT, formData);
    return toSavedCv(response.data.data);
  },

  deleteCv: async (): Promise<void> => {
    await apiClient.delete(CV_ENDPOINT);
  },
};
