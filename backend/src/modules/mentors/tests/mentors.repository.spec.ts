import { describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../../common/prisma/prisma.service.js';
import { MENTOR_ROLE_NAME } from '../constants/mentor.constants.js';
import { MentorsRepository } from '../repositories/mentors.repository.js';

describe('MentorsRepository', () => {
  it('busca solo el id del rol mentor', async () => {
    const role = { id: 'mentor-role-id' };
    const findUnique = vi.fn().mockResolvedValue(role);
    const prisma = { role: { findUnique } } as unknown as PrismaService;
    const repository = new MentorsRepository(prisma);

    const result = await repository.findMentorRole();

    expect(findUnique).toHaveBeenCalledWith({
      where: {
        name: MENTOR_ROLE_NAME,
      },
      select: {
        id: true,
      },
    });
    expect(result).toBe(role);
  });

  it('busca solo el id de la asignacion activa del rol', async () => {
    const userRole = { id: 'user-role-id' };
    const findFirst = vi.fn().mockResolvedValue(userRole);
    const prisma = { userRole: { findFirst } } as unknown as PrismaService;
    const repository = new MentorsRepository(prisma);

    const result = await repository.findActiveUserRole('user-1', 'role-1');

    expect(findFirst).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        roleId: 'role-1',
        deletedAt: null,
      },
      select: {
        id: true,
      },
    });
    expect(result).toBe(userRole);
  });

  it('busca solo los ids de las areas tecnicas solicitadas', async () => {
    const areas = [{ id: 'area-1' }];
    const findMany = vi.fn().mockResolvedValue(areas);
    const prisma = {
      technicalArea: { findMany },
    } as unknown as PrismaService;
    const repository = new MentorsRepository(prisma);

    const result = await repository.findTechnicalAreas(['area-1']);

    expect(findMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ['area-1'],
        },
      },
      select: {
        id: true,
      },
    });
    expect(result).toBe(areas);
  });

  it('busca solo los ids de orientaciones activas solicitadas', async () => {
    const orientationTypes = [{ id: 'orientation-1' }];
    const findMany = vi.fn().mockResolvedValue(orientationTypes);
    const prisma = {
      orientationType: { findMany },
    } as unknown as PrismaService;
    const repository = new MentorsRepository(prisma);

    const result = await repository.findActiveOrientationTypes([
      'orientation-1',
    ]);

    expect(findMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ['orientation-1'],
        },
        isActive: true,
      },
      select: {
        id: true,
      },
    });
    expect(result).toBe(orientationTypes);
  });

  it('crea atomicamente el rol y las relaciones del mentor', async () => {
    const createUserRole = vi.fn().mockResolvedValue({ id: 'user-role-id' });
    const createTechnicalAreas = vi.fn().mockResolvedValue({ count: 2 });
    const createOrientationTypes = vi.fn().mockResolvedValue({ count: 2 });
    const transaction = {
      userRole: { create: createUserRole },
      mentorTechnicalArea: { createMany: createTechnicalAreas },
      mentorOrientationType: { createMany: createOrientationTypes },
    };
    const $transaction = vi.fn(async (callback) => callback(transaction));
    const prisma = { $transaction } as unknown as PrismaService;
    const repository = new MentorsRepository(prisma);

    const result = await repository.activate(
      'user-1',
      'role-1',
      ['area-1', 'area-2'],
      ['orientation-1', 'orientation-2'],
    );

    expect($transaction).toHaveBeenCalledTimes(1);
    expect(createUserRole).toHaveBeenCalledWith({
      data: {
        userId: 'user-1',
        roleId: 'role-1',
        deletedAt: null,
      },
    });
    expect(createTechnicalAreas).toHaveBeenCalledWith({
      data: [
        { mentorId: 'user-1', technicalAreaId: 'area-1' },
        { mentorId: 'user-1', technicalAreaId: 'area-2' },
      ],
    });
    expect(createOrientationTypes).toHaveBeenCalledWith({
      data: [
        { mentorId: 'user-1', orientationTypeId: 'orientation-1' },
        { mentorId: 'user-1', orientationTypeId: 'orientation-2' },
      ],
    });
    expect(result).toEqual({ id: 'user-1' });
  });

  it('propaga un fallo de escritura y no ejecuta escrituras posteriores', async () => {
    const writeError = new Error('write failed');
    const createUserRole = vi.fn().mockResolvedValue({ id: 'user-role-id' });
    const createTechnicalAreas = vi.fn().mockRejectedValue(writeError);
    const createOrientationTypes = vi.fn();
    const transaction = {
      userRole: { create: createUserRole },
      mentorTechnicalArea: { createMany: createTechnicalAreas },
      mentorOrientationType: { createMany: createOrientationTypes },
    };
    const $transaction = vi.fn(async (callback) => callback(transaction));
    const prisma = { $transaction } as unknown as PrismaService;
    const repository = new MentorsRepository(prisma);

    await expect(
      repository.activate(
        'user-1',
        'role-1',
        ['area-1'],
        ['orientation-1'],
      ),
    ).rejects.toBe(writeError);
    expect($transaction).toHaveBeenCalledTimes(1);
    expect(createUserRole).toHaveBeenCalledTimes(1);
    expect(createTechnicalAreas).toHaveBeenCalledTimes(1);
    expect(createOrientationTypes).not.toHaveBeenCalled();
  });
});
