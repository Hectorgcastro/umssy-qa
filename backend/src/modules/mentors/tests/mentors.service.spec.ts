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
  const userId = 'user-1';
  const roleId = 'mentor-role-id';
  const data = {
    technicalAreaIds: ['0424f370-00f0-43cf-9b8a-997af81840b9'],
    orientationTypeIds: ['0fa5e6de-63a4-430e-87fb-22f5eb700ecd'],
  };

  it('valida los catalogos y activa al usuario autenticado', async () => {
    const activationResult = { id: userId };
    const findMentorRole = vi.fn().mockResolvedValue({ id: roleId });
    const findActiveUserRole = vi.fn().mockResolvedValue(null);
    const findTechnicalAreas = vi.fn().mockResolvedValue([
      { id: data.technicalAreaIds[0] },
    ]);
    const findActiveOrientationTypes = vi.fn().mockResolvedValue([
      { id: data.orientationTypeIds[0] },
    ]);
    const activate = vi.fn().mockResolvedValue(activationResult);
    const repository = {
      findMentorRole,
      findActiveUserRole,
      findTechnicalAreas,
      findActiveOrientationTypes,
      activate,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    const result = await service.activate(userId, data);

    expect(findMentorRole).toHaveBeenCalledTimes(1);
    expect(findActiveUserRole).toHaveBeenCalledWith(userId, roleId);
    expect(findTechnicalAreas).toHaveBeenCalledWith(data.technicalAreaIds);
    expect(findActiveOrientationTypes).toHaveBeenCalledWith(
      data.orientationTypeIds,
    );
    expect(activate).toHaveBeenCalledWith(
      userId,
      roleId,
      data.technicalAreaIds,
      data.orientationTypeIds,
    );
    expect(result).toBe(activationResult);
  });

  it('rechaza la activacion si no existe el rol mentor', async () => {
    const activate = vi.fn();
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue(null),
      activate,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    await expect(service.activate(userId, data)).rejects.toBeInstanceOf(
      MentorRoleNotFoundException,
    );
    expect(activate).not.toHaveBeenCalled();
  });

  it('rechaza la activacion si el usuario ya es mentor', async () => {
    const activate = vi.fn();
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue({ id: roleId }),
      findActiveUserRole: vi.fn().mockResolvedValue({ id: 'user-role-id' }),
      activate,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    await expect(service.activate(userId, data)).rejects.toBeInstanceOf(
      AlreadyMentorException,
    );
    expect(activate).not.toHaveBeenCalled();
  });

  it('rechaza la activacion si existen areas tecnicas invalidas', async () => {
    const activate = vi.fn();
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue({ id: roleId }),
      findActiveUserRole: vi.fn().mockResolvedValue(null),
      findTechnicalAreas: vi.fn().mockResolvedValue([]),
      activate,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    await expect(service.activate(userId, data)).rejects.toBeInstanceOf(
      InvalidTechnicalAreasException,
    );
    expect(activate).not.toHaveBeenCalled();
  });

  it('rechaza la activacion si existen orientaciones invalidas o inactivas', async () => {
    const activate = vi.fn();
    const repository = {
      findMentorRole: vi.fn().mockResolvedValue({ id: roleId }),
      findActiveUserRole: vi.fn().mockResolvedValue(null),
      findTechnicalAreas: vi.fn().mockResolvedValue([
        { id: data.technicalAreaIds[0] },
      ]),
      findActiveOrientationTypes: vi.fn().mockResolvedValue([]),
      activate,
    } as unknown as MentorsRepository;
    const service = new MentorsService(repository);

    await expect(service.activate(userId, data)).rejects.toBeInstanceOf(
      InvalidOrientationTypesException,
    );
    expect(activate).not.toHaveBeenCalled();
  });
});
