import { apiClient } from "@/shared/services/api-client";
import {
  CERTIFICATION_DOCUMENT_FIELD_NAME,
  CERTIFICATIONS_ENDPOINT,
  getCertificationDocumentEndpoint,
} from "../config/certification-api.config";
import type { ApiResponse } from "../types/api-response.types";
import type { Certification } from "../types/certification.types";
import type { CreateCertificationDto } from "../types/create-certification-dto.types";
import type { UpdateCertificationDto } from "../types/update-certification-dto.types";
import { getAuthHeaders } from "../utils/get-auth-headers";
import { getHttpStatus } from "../utils/get-http-status";

const NOT_FOUND_STATUS = 404;

// Sample data until the endpoints are connected (issue #94)
let sampleCertifications: Certification[] = [];
const sampleDocuments = new Map<string, Blob>();

function setSampleDocument(id: string, document: Blob | null) {
  if (document) {
    sampleDocuments.set(id, document);
  } else {
    sampleDocuments.delete(id);
  }
  sampleCertifications = sampleCertifications.map((certification) =>
    certification.id === id ? { ...certification, hasDocument: document !== null } : certification,
  );
}

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
      const response = await apiClient.get<ApiResponse<Certification[]>>(CERTIFICATIONS_ENDPOINT, {
        headers: getAuthHeaders(),
      });
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
        { headers: getAuthHeaders() },
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
        { headers: getAuthHeaders() },
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
      await apiClient.delete(`${CERTIFICATIONS_ENDPOINT}/${id}`, { headers: getAuthHeaders() });
    } catch (error) {
      if (!isEndpointUnavailable(error)) {
        throw error;
      }
      sampleCertifications = sampleCertifications.filter(
        (certification) => certification.id !== id,
      );
      sampleDocuments.delete(id);
    }
  },

  uploadDocument: async (id: string, file: File): Promise<void> => {
    const formData = new FormData();
    formData.append(CERTIFICATION_DOCUMENT_FIELD_NAME, file);
    try {
      await apiClient.put(getCertificationDocumentEndpoint(id), formData, {
        headers: getAuthHeaders(),
      });
    } catch (error) {
      if (!isEndpointUnavailable(error)) {
        throw error;
      }
      setSampleDocument(id, file);
    }
  },

  getDocument: async (id: string): Promise<Blob | null> => {
    try {
      const response = await apiClient.get<Blob>(getCertificationDocumentEndpoint(id), {
        responseType: "blob",
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      if (isEndpointUnavailable(error)) {
        return sampleDocuments.get(id) ?? null;
      }
      throw error;
    }
  },

  deleteDocument: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(getCertificationDocumentEndpoint(id), { headers: getAuthHeaders() });
    } catch (error) {
      if (!isEndpointUnavailable(error)) {
        throw error;
      }
      setSampleDocument(id, null);
    }
  },
};
