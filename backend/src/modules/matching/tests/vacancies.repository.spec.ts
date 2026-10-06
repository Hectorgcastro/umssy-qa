import { describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../../common/prisma/prisma.service.js';
import { VacanciesRepository } from '../repositories/vacancies.repository.js';

describe('Active vacancies (#233)', () => {
  it('filters inactive and expired vacancies and excludes private user fields', async () => {
    const prisma = { vacancy: { findMany: vi.fn().mockResolvedValue([]) }, user: { findFirst: vi.fn().mockResolvedValue(null) } };
    const repository = new VacanciesRepository(prisma as unknown as PrismaService);
    await repository.findActive();
    expect(prisma.vacancy.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: expect.any(Date) } }] } }));
    await repository.findProfile('owner');
    expect(prisma.user.findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'owner', isActive: true } }));
    expect(prisma.user.findFirst.mock.calls[0]?.[0].select).not.toHaveProperty('password');
  });
});
