import { apiClient } from "@/shared/services/api-client";
import type { AvailabilityBlock, CreateAvailabilityBlockInput, AvailabilityFilters } from "../types/availability";

function toISOString(value: string): string {
  return new Date(value).toISOString();
}

type CreatePayload = CreateAvailabilityBlockInput & { seriesId: string; startAt: string; endAt: string };
type UpdatePayload = Partial<CreateAvailabilityBlockInput> & { startAt?: string; endAt?: string };

export const availabilityApi = {
  getAvailabilityBlocks: async (filters?: AvailabilityFilters): Promise<AvailabilityBlock[]> => {
    const params = new URLSearchParams();
    if (filters?.mentorId) params.append("mentorId", filters.mentorId);
    if (filters?.startAt) params.append("startAt", toISOString(filters.startAt));
    if (filters?.endAt) params.append("endAt", toISOString(filters.endAt));
    const response = await apiClient.get<AvailabilityBlock[]>(`/availability-blocks?${params.toString()}`);
    return response.data;
  },

  getAvailabilityBlockById: async (id: string): Promise<AvailabilityBlock> => {
    const response = await apiClient.get<AvailabilityBlock>(`/availability-blocks/${id}`);
    return response.data;
  },

  createAvailabilityBlock: async (input: CreateAvailabilityBlockInput): Promise<AvailabilityBlock> => {
    const payload: CreatePayload = {
      ...input,
      startAt: toISOString(input.startAt),
      endAt: toISOString(input.endAt),
      seriesId: crypto.randomUUID(),
    };
    const response = await apiClient.post<AvailabilityBlock>("/availability-blocks", payload);
    return response.data;
  },

  updateAvailabilityBlock: async (id: string, input: Partial<CreateAvailabilityBlockInput>): Promise<AvailabilityBlock> => {
    const payload: UpdatePayload = { ...input };
    if (input.startAt) payload.startAt = toISOString(input.startAt);
    if (input.endAt) payload.endAt = toISOString(input.endAt);
    const response = await apiClient.patch<AvailabilityBlock>(`/availability-blocks/${id}`, payload);
    return response.data;
  },

  deleteAvailabilityBlock: async (id: string): Promise<void> => {
    await apiClient.delete(`/availability-blocks/${id}`);
  },
};
