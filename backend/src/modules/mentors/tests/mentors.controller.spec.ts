import { describe, expect, it, vi } from 'vitest';
import { MentorsController } from '../controllers/mentors.controller.js';
import type { MentorsService } from '../services/mentors.service.js';

describe('MentorsController', () => {
  it('delega la consulta del directorio al service', async () => {
    const directoryResult = [
      {
        id: 'user-1',
        fullName: 'Ana Rojas',
        headline: 'Arquitecta de Software',
        technicalAreas: ['Backend', 'Cloud'],
      },
    ];
    const findAll = vi.fn().mockResolvedValue(directoryResult);
    const service = { findAll } as unknown as MentorsService;
    const controller = new MentorsController(service);

    const result = await controller.findAll();

    expect(findAll).toHaveBeenCalledTimes(1);
    expect(result).toBe(directoryResult);
  });

  it('delega la activacion con el id del usuario autenticado', async () => {
    const activationResult = { id: 'user-1' };
    const activate = vi.fn().mockResolvedValue(activationResult);
    const service = { activate } as unknown as MentorsService;
    const controller = new MentorsController(service);
    const user = { id: 'user-1' };
    const body = {
      technicalAreaIds: ['0424f370-00f0-43cf-9b8a-997af81840b9'],
      orientationTypeIds: ['0fa5e6de-63a4-430e-87fb-22f5eb700ecd'],
    };

    const result = await controller.activate(user, body);

    expect(activate).toHaveBeenCalledTimes(1);
    expect(activate).toHaveBeenCalledWith('user-1', body);
    expect(result).toBe(activationResult);
  });
});
