import { describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../../common/prisma/prisma.service.js';
import { MentorsRepository } from '../repositories/mentors.repository.js';

describe('MentorsRepository', () => {
  it('busca el rol mentor', async () => {
    const findUnique = vi.fn().mockResolvedValue({
      id: 'mentor-role-id',
      name: 'mentor',
    });

    const prisma = {
      role: {
        findUnique,
      },
    } as unknown as PrismaService;

    const repository = new MentorsRepository(prisma);

    const result = await repository.findMentorRole();

    expect(findUnique).toHaveBeenCalledWith({
      where: {
        name: 'mentor',
      },
    });

    expect(result).toEqual({
      id: 'mentor-role-id',
      name: 'mentor',
    });
  });

  it('busca un rol activo del usuario', async () => {
    const findFirst = vi.fn().mockResolvedValue({
      id: 'role-user-id',
    });

    const prisma = {
      userRole: {
        findFirst,
      },
    } as unknown as PrismaService;

    const repository = new MentorsRepository(prisma);

    await repository.findActiveUserRole(
      'user-1',
      'role-1',
    );

    expect(findFirst).toHaveBeenCalledWith({
      where: {
        userId: 'user-1',
        roleId: 'role-1',
        deletedAt: null,
      },
    });
  });

  it('busca áreas técnicas por ids', async () => {
    const findMany = vi.fn().mockResolvedValue([
      {
        id: 'area-1',
      },
    ]);

    const prisma = {
      technicalArea: {
        findMany,
      },
    } as unknown as PrismaService;

    const repository = new MentorsRepository(prisma);

    await repository.findTechnicalAreas([
      'area-1',
    ]);

    expect(findMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ['area-1'],
        },
      },
    });
  });

  it('busca tipos de orientación activos', async () => {
    const findMany = vi.fn().mockResolvedValue([
      {
        id: 'orientation-1',
      },
    ]);

    const prisma = {
      orientationType: {
        findMany,
      },
    } as unknown as PrismaService;

    const repository = new MentorsRepository(prisma);

    await repository.findActiveOrientationTypes([
      'orientation-1',
    ]);

    expect(findMany).toHaveBeenCalledWith({
      where: {
        id: {
          in: ['orientation-1'],
        },
        isActive: true,
      },
    });
  });

  it('activa un mentor mediante transacción', async () => {
    const create = vi.fn();
    const createMany = vi.fn();
    const findUnique = vi.fn().mockResolvedValue({
      id: 'user-1',
    });

    const transaction = {
      userRole: {
        create,
      },
      mentorTechnicalArea: {
        createMany,
      },
      mentorOrientationType: {
        createMany,
      },
      user: {
        findUnique,
      },
    };

    const $transaction = vi.fn(async (callback) =>
      callback(transaction),
    );

    const prisma = {
      $transaction,
    } as unknown as PrismaService;

    const repository = new MentorsRepository(prisma);

    const result = await repository.activate(
      'user-1',
      'role-1',
      ['area-1'],
      ['orientation-1'],
    );

    expect(create).toHaveBeenCalled();
    expect(createMany).toHaveBeenCalledTimes(2);
    expect(findUnique).toHaveBeenCalled();
    expect(result).toEqual({
      id: 'user-1',
    });
  });
});