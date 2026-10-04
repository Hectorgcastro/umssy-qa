import { apiClient } from "@/shared/services/api-client";
import { CERTIFICATIONS_ENDPOINT } from "../config/certification-api.config";
import type { ApiResponse } from "../types/api-response.types";
import type { Certification } from "../types/certification.types";
import type { CreateCertificationDto } from "../types/create-certification-dto.types";
import type { UpdateCertificationDto } from "../types/update-certification-dto.types";
import { getHttpStatus } from "../utils/get-http-status";

const NOT_FOUND_STATUS = 404;

let sampleCertifications: Certification[] = [];

function isEndpointUnavailable(error: unknown): boolean {
  const status = getHttpStatus(error);
  return status === undefined || status === NOT_FOUND_STATUS;
}

function createSampleCertification(data: CreateCertificationDto): Certification {
  const timestamp = new Date().toISOString();
  const certification: Certification = {
    id: crypto.randomUUID(),
    ...data,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
  sampleCertifications = [...sampleCertifications, certification];
  return certification;
}

function updateSampleCertification(id: string, data: UpdateCertificationDto): Certification {
  const current = sampleCertifications.find((certification) => certification.id === id);
  if (!current) {
    throw new Error(`Certification ${id} not found`);
  }
  const updated: Certification = { ...current, ...data, updatedAt: new Date().toISOString() };
  sampleCertifications = sampleCertifications.map((certification) =>
    certification.id === id ? updated : certification,
  );
  return updated;
}

export const certificationsService = {
  getCertifications: async (): Promise<Certification[]> => {
    try {
      const response = await apiClient.get<ApiResponse<Certification[]>>(CERTIFICATIONS_ENDPOINT);
      return response.data.data;
    } catch (error) {
      if (isEndpointUnavailable(error)) {
        return sampleCertifications;
      }
      throw error;
    }
  },

  createCertification: async (data: CreateCertificationDto): Promise<Certification> => {
    try {
      const response = await apiClient.post<ApiResponse<Certification>>(
        CERTIFICATIONS_ENDPOINT,
        data,
      );
      return response.data.data;
    } catch (error) {
      if (isEndpointUnavailable(error)) {
        return createSampleCertification(data);
      }
      throw error;
    }
  },

  updateCertification: async (
    id: string,
    data: UpdateCertificationDto,
  ): Promise<Certification> => {
    try {
      const response = await apiClient.patch<ApiResponse<Certification>>(
        `${CERTIFICATIONS_ENDPOINT}/${id}`,
        data,
      );
      return response.data.data;
    } catch (error) {
      if (isEndpointUnavailable(error)) {
        return updateSampleCertification(id, data);
      }
      throw error;
    }
  },

  deleteCertification: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`${CERTIFICATIONS_ENDPOINT}/${id}`);
    } catch (error) {
      if (!isEndpointUnavailable(error)) {
        throw error;
      }
      sampleCertifications = sampleCertifications.filter(
        (certification) => certification.id !== id,
      );
    }
  },
};
