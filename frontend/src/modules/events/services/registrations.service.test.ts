// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { apiClient } from '@/shared/services/api-client';
import { registrationsService } from './registrations.service';

vi.mock('@/shared/services/api-client', () => ({ apiClient: { defaults: { baseURL: 'http://localhost/api' }, get: vi.fn() } }));

describe('registrationsService', () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    vi.stubGlobal('sessionStorage', { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) });
    vi.clearAllMocks();
  });
  it('envía el token de sesión y devuelve las inscripciones del backend', async () => {
    sessionStorage.setItem('accessToken', 'signed-token');
    const items = [{ id: 'registration-1' }];
    vi.mocked(apiClient.get).mockResolvedValue({ data: { data: items } });
    const signal = new AbortController().signal;
    await expect(registrationsService.getMine(signal)).resolves.toEqual(items);
    expect(apiClient.get).toHaveBeenCalledWith('/event-registrations/me', {
      headers: { Authorization: 'Bearer signed-token' }, signal,
    });
  });
  it('no consulta sin sesión', async () => {
    await expect(registrationsService.getMine()).rejects.toThrow('Debes iniciar sesión');
    expect(apiClient.get).not.toHaveBeenCalled();
  });
});
