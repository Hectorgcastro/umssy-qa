import { apiClient } from '@/shared/services/api-client';
import type { EventsListResponse, GetEventsParams } from '../types/event.types';

export const eventsService = {
  async getEvents(
    params: GetEventsParams,
    signal?: AbortSignal,
  ): Promise<EventsListResponse> {
    if (!apiClient.defaults.baseURL) {
      throw new Error('La URL del backend no está configurada.');
    }

    const response = await apiClient.get<EventsListResponse>('/events', {
      params,
      signal,
    });

    return response.data;
  },
};