import { afterEach, describe, expect, it, vi } from 'vitest';
import { VacanciesRepository } from '../repositories/vacancies.repository.js';
import { VacanciesService } from '../services/vacancies.service.js';
import { VacanciesController } from '../controllers/vacancies.controller.js';
import { vacanciesQuerySchema } from '../requests/vacancies-query.schema.js';
import type { PrismaService } from '../../../common/prisma/prisma.service.js';

describe('Active vacancy endpoint (#233)', () => {
  afterEach(() => vi.useRealTimers());
  it('filters expired and inactive vacancies and applies stable pagination', async () => {
    vi.useFakeTimers();
    const now = new Date('2026-10-07T12:00:00Z');
    vi.setSystemTime(now);
    const vacancy = { findMany: vi.fn().mockResolvedValue([]) };
    const repository = new VacanciesRepository({
      vacancy,
    } as unknown as PrismaService);
    const controller = new VacanciesController(
      new VacanciesService(repository),
    );
    expect(await controller.findActive({ page: 2, limit: 10 })).toEqual([]);
    expect(vacancy.findMany).toHaveBeenCalledWith({
      where: {
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip: 10,
      take: 10,
    });
  });
  it('accepts defaults and numeric strings', () => {
    expect(vacanciesQuerySchema.parse({})).toEqual({ page: 1, limit: 20 });
    expect(vacanciesQuerySchema.parse({ page: '2', limit: '10' })).toEqual({
      page: 2,
      limit: 10,
    });
  });
  it.each([{ page: 0 }, { page: 1.5 }, { limit: 101 }, { page: 'oops' }])(
    'rejects invalid paging %j',
    (query) => {
      expect(vacanciesQuerySchema.safeParse(query).success).toBe(false);
    },
  );
});
