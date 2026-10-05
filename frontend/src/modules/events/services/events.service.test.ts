// @vitest-environment node
import { AxiosHeaders, type AxiosResponse } from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/shared/services/api-client';
import { eventsService } from './events.service';
import type { EventsListResponse } from '../types/event.types';

const MOCK_RESPONSE: EventsListResponse = {
  data: [],
  page: 1,
  offset: 0,
};

const originalBaseUrl = apiClient.defaults.baseURL;

describe('eventsService', () => {
  beforeEach(() => {
    apiClient.defaults.baseURL = 'http://localhost:8080/api';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    apiClient.defaults.baseURL = originalBaseUrl;
  });

  it('consulta GET /events con paginacion y devuelve el DTO del backend', async () => {
    const response = {
      data: {
        statusCode: 200,
        ok: true,
        detail: 'Operación exitosa',
        data: { items: MOCK_RESPONSE.data, total: 0, limit: 50, totalPages: 0 },
        page: MOCK_RESPONSE.page,
        offset: MOCK_RESPONSE.offset,
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: { headers: new AxiosHeaders() },
    } as unknown as AxiosResponse<EventsListResponse>;
    const getSpy = vi.spyOn(apiClient, 'get').mockResolvedValueOnce(response);
    const abortController = new AbortController();

    await expect(
      eventsService.getEvents({ page: 1, limit: 50 }, abortController.signal),
    ).resolves.toEqual(MOCK_RESPONSE);
    expect(getSpy).toHaveBeenCalledWith('/events', {
      params: { page: 1, limit: 50 },
      signal: abortController.signal,
    });
  });

  it('falla claramente si falta configurar la URL del backend', async () => {
    apiClient.defaults.baseURL = undefined;

    await expect(eventsService.getEvents({ page: 1, limit: 50 })).rejects.toThrow(
      'La URL del backend no está configurada.',
    );
  });
});