import { beforeEach, describe, expect, it, vi } from 'vitest';
import { OrientationTypesController } from '../controllers/orientation-types.controller.js';
import type { OrientationTypesService } from '../services/orientation-types.service.js';
import type { OrientationTypeResponse } from '../types/orientation-type-response.types.js';

describe('OrientationTypesController', () => {
  const findAll = vi.fn<() => Promise<OrientationTypeResponse[]>>();
  const service = { findAll } as unknown as OrientationTypesService;
  let controller: OrientationTypesController;

  beforeEach(() => {
    vi.clearAllMocks();
    controller = new OrientationTypesController(service);
  });

  it('delega la consulta sin parámetros y devuelve el resultado del service', async () => {
    const orientationTypes: OrientationTypeResponse[] = [
      {
        id: '11111111-1111-4111-8111-111111111111',
        name: 'Orientación profesional',
        description: 'Apoyo para el desarrollo profesional',
      },
    ];
    findAll.mockResolvedValue(orientationTypes);

    await expect(controller.findAll()).resolves.toBe(orientationTypes);
    expect(findAll).toHaveBeenCalledOnce();
    expect(findAll).toHaveBeenCalledWith();
  });
});
