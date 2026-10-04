import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../../common/prisma/prisma.service.js';
import { UserSkillRepository } from '../repositories/user-skill.repository.js';

const userId = '11111111-1111-4111-8111-111111111111';
const skillId = '33333333-3333-4333-8333-333333333333';

describe('UserSkillRepository', () => {
  let repository: UserSkillRepository;
  let userSkill: { findMany: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    userSkill = { findMany: vi.fn() };
    repository = new UserSkillRepository({ userSkill } as unknown as PrismaService);
  });

  it('lists the skills of the user in the order they were added', async () => {
    const records = [{ skill: { id: skillId, name: 'Python', isCustom: false } }];
    userSkill.findMany.mockResolvedValue(records);

    await expect(repository.findByUserId(userId)).resolves.toBe(records);
    expect(userSkill.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      select: { skill: { select: { id: true, name: true, isCustom: true } } },
    });
  });
});
