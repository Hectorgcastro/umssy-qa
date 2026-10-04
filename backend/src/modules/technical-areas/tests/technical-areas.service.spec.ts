import { describe, expect, it, vi } from 'vitest';
import type { TechnicalAreasRepository } from '../repositories/technical-areas.repository.js';
import { TechnicalAreasService } from '../services/technical-areas.service.js';

describe('TechnicalAreasService', () => {
  it('delega la consulta al repositorio y devuelve su resultado', async () => {
    const areas = [
      { id: 'area-1', name: 'Backend', description: 'APIs' },
    ];
    const findAll = vi.fn().mockResolvedValue(areas);
    const repository = {
      findAll,
    } as unknown as TechnicalAreasRepository;
    const service = new TechnicalAreasService(repository);

    const result = await service.findAll();

    expect(findAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual(areas);
  });

  it('devuelve una lista vacia cuando no existen areas', async () => {
    const repository = {
      findAll: vi.fn().mockResolvedValue([]),
    } as unknown as TechnicalAreasRepository;
    const service = new TechnicalAreasService(repository);

    await expect(service.findAll()).resolves.toEqual([]);
  });
});
