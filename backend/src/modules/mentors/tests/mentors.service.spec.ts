import { describe, expect, it, vi } from 'vitest';
import type { MentorsRepository } from '../repositories/mentors.repository.js';
import { MentorsService } from '../services/mentors.service.js';
import {
  AlreadyMentorException,
  InvalidOrientationTypesException,
  InvalidTechnicalAreasException,
  MentorRoleNotFoundException,
} from '../exceptions/index.js';

describe('MentorsService', () => {
  const data = {
    technicalAreaIds: ['area-1'],
    orientationTypeIds: ['orientation-1'],
  };

  it('activa un usuario como mentor correctamente', async () => {
    const activate = vi.fn().mockResolvedValue({
      id: 'mentor-1',
    });

    const repository = {
      findMentorRole: vi.fn().mockResolvedValue({
        id: 'mentor-role-id',
      }),
      findActiveUserRole: vi.fn().mockResolvedValue(null),
      findTechnicalAreas: vi.fn().mockResolvedValue([
        { id: 'area-1' },
      ]),
      findActiveOrientationTypes: vi.fn().mockResolvedValue([
        { id: 'orientation-1' },
      ]),
      activate,
    } as unknown as MentorsRepository;

    const service = new MentorsService(repository);

    const result = await service.activate('user-1', data);

    expect(activate).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      id: 'mentor-1',
    });
  });

  it('lanza error si no existe el rol mentor', async () => {
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue(null),
    } as unknown as MentorsRepository;

    const service = new MentorsService(repository);

    await expect(
      service.activate('user-1', data),
    ).rejects.toBeInstanceOf(MentorRoleNotFoundException);
  });

  it('lanza error si el usuario ya es mentor', async () => {
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue({
        id: 'mentor-role-id',
      }),
      findActiveUserRole: vi.fn().mockResolvedValue({
        id: 'role-1',
      }),
    } as unknown as MentorsRepository;

    const service = new MentorsService(repository);

    await expect(
      service.activate('user-1', data),
    ).rejects.toBeInstanceOf(AlreadyMentorException);
  });

  it('lanza error si hay áreas técnicas inválidas', async () => {
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue({
        id: 'mentor-role-id',
      }),
      findActiveUserRole: vi.fn().mockResolvedValue(null),
      findTechnicalAreas: vi.fn().mockResolvedValue([]),
    } as unknown as MentorsRepository;

    const service = new MentorsService(repository);

    await expect(
      service.activate('user-1', data),
    ).rejects.toBeInstanceOf(InvalidTechnicalAreasException);
  });

  it('lanza error si hay tipos de orientación inválidos', async () => {
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue({
        id: 'mentor-role-id',
      }),
      findActiveUserRole: vi.fn().mockResolvedValue(null),
      findTechnicalAreas: vi.fn().mockResolvedValue([
        { id: 'area-1' },
      ]),
      findActiveOrientationTypes: vi.fn().mockResolvedValue([]),
    } as unknown as MentorsRepository;

    const service = new MentorsService(repository);

    await expect(
      service.activate('user-1', data),
    ).rejects.toBeInstanceOf(InvalidOrientationTypesException);
  });
});