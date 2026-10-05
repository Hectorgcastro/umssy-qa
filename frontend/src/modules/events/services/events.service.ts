import { apiClient } from '@/shared/services/api-client';
import type { EventItem, EventsListResponse, GetEventsParams } from '../types/event.types';

const REQUEST_TIMEOUT_MS = 10_000;

export const eventsService = {
  async getEvents(
    params: GetEventsParams,
    signal?: AbortSignal,
  ): Promise<EventsListResponse> {
    if (!apiClient.defaults.baseURL) {
      throw new Error('La URL del backend no está configurada.');
    }

    const response = await apiClient.get<{ data: { items: EventItem[] }; page: number; offset: number }>('/events', {
      params,
      signal,
      timeout: REQUEST_TIMEOUT_MS,
    });

    return {
      data: response.data.data.items,
      page: response.data.page,
      offset: response.data.offset,
    };
  },
};