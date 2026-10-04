import { apiClient } from "@/shared/services/api-client";
import { PHOTO_ENDPOINT, PHOTO_UPLOAD_FIELD_NAME } from "../config/photo-api.config";
import { NOT_FOUND_STATUS } from "../constants/http-status.constants";
import { getHttpStatus } from "../utils/get-http-status";

export const profilePhotoService = {
  getPhoto: async (): Promise<Blob | null> => {
    try {
      const response = await apiClient.get<Blob>(PHOTO_ENDPOINT, { responseType: "blob" });
      return response.data;
    } catch (error) {
      if (getHttpStatus(error) === NOT_FOUND_STATUS) {
        return null;
      }
      throw error;
    }
  },

  uploadPhoto: async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append(PHOTO_UPLOAD_FIELD_NAME, file);
    await apiClient.put(PHOTO_ENDPOINT, formData);
  },
};
