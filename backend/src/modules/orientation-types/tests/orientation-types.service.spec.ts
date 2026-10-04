import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { OrientationTypesRepository } from '../repositories/orientation-types.repository.js';
import { OrientationTypesService } from '../services/orientation-types.service.js';
import type { OrientationTypeResponse } from '../types/orientation-type-response.types.js';

describe('OrientationTypesService', () => {
  const findActive = vi.fn<() => Promise<OrientationTypeResponse[]>>();
  const repository = { findActive } as unknown as OrientationTypesRepository;
  let service: OrientationTypesService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new OrientationTypesService(repository);
  });

  it('devuelve exactamente el catálogo entregado por el repository', async () => {
    const orientationTypes: OrientationTypeResponse[] = [
      {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Orientación profesional',
        description: null,
      },
    ];
    findActive.mockResolvedValue(orientationTypes);

    await expect(service.findAll()).resolves.toBe(orientationTypes);
    expect(findActive).toHaveBeenCalledOnce();
  });

  it('devuelve un arreglo vacío sin convertirlo en error', async () => {
    findActive.mockResolvedValue([]);

    await expect(service.findAll()).resolves.toEqual([]);
    expect(findActive).toHaveBeenCalledOnce();
  });
});
