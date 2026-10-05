import type { EventCategoryItem } from '../types/event.types';
import { apiClient } from '@/shared/services/api-client';

const REQUEST_TIMEOUT_MS = 10_000;

export const eventCategoriesService = {
  async getAll(): Promise<EventCategoryItem[]> {
    if (!apiClient.defaults.baseURL) {
      throw new Error('La URL del backend no está configurada.');
    }

    const response = await apiClient.get<{
      data: { items: EventCategoryItem[] };
    }>('/event-categories', {
      params: { page: 1, limit: 50 },
      timeout: REQUEST_TIMEOUT_MS,
    });

    return response.data.data.items;
  },
};