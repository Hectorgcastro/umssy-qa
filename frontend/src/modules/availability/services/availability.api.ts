import { apiClient } from "@/shared/services/api-client";
import type { AvailabilityBlock, CreateAvailabilityBlockInput, AvailabilityFilters } from "../types/availability";

export const availabilityApi = {
  getAvailabilityBlocks: async (filters?: AvailabilityFilters): Promise<AvailabilityBlock[]> => {
    const params = new URLSearchParams();
    if (filters?.mentorId) params.append("mentorId", filters.mentorId);
    if (filters?.startAt) params.append("startAt", filters.startAt);
    if (filters?.endAt) params.append("endAt", filters.endAt);
    const response = await apiClient.get<AvailabilityBlock[]>(`/availability?${params.toString()}`);
    return response.data;
  },

  getAvailabilityBlockById: async (id: string): Promise<AvailabilityBlock> => {
    const response = await apiClient.get<AvailabilityBlock>(`/availability/${id}`);
    return response.data;
  },

  createAvailabilityBlock: async (input: CreateAvailabilityBlockInput): Promise<AvailabilityBlock> => {
    const response = await apiClient.post<AvailabilityBlock>("/availability", input);
    return response.data;
  },

  updateAvailabilityBlock: async (id: string, input: Partial<CreateAvailabilityBlockInput>): Promise<AvailabilityBlock> => {
    const response = await apiClient.patch<AvailabilityBlock>(`/availability/${id}`, input);
    return response.data;
  },

  deleteAvailabilityBlock: async (id: string): Promise<void> => {
    await apiClient.delete(`/availability/${id}`);
  },
};
