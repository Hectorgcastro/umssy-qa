import { describe, expect, it, vi } from 'vitest';
import type { PrismaService } from '../../../common/prisma/prisma.service.js';
import { ExperienceAnalysisService } from '../services/experience-analysis.service.js';
import { MatchingService } from '../services/matching.service.js';

describe('Experience analysis ownership and persistence (#189)', () => {
  function setup(description: string | null = 'Python') {
    const workExperience = {
      findFirst: vi.fn().mockResolvedValue({ description }),
      updateMany: vi.fn().mockResolvedValue({ count: 1 }),
    };
    return {
      workExperience,
      service: new ExperienceAnalysisService(
        { workExperience } as unknown as PrismaService,
        new MatchingService(),
      ),
    };
  }
  it('writes only canonical detected tags for the owning experience', async () => {
    const { service, workExperience } = setup();
    const result = await service.analyze('owner', {
      experienceId: 'e',
      text: 'Python',
    });
    expect(result.skills.map(({ name }) => name)).toEqual(['Python']);
    expect(workExperience.updateMany).toHaveBeenCalledWith({
      where: { id: 'e', userId: 'owner', description: 'Python' },
      data: { detectedSkills: ['Python'] },
    });
  });
  it('rejects another owner, stale text and concurrent edits', async () => {
    const { service, workExperience } = setup();
    await expect(
      service.analyze('owner', { experienceId: 'e', text: 'Scrum' }),
    ).rejects.toMatchObject({ statusCode: 409 });
    expect(workExperience.updateMany).not.toHaveBeenCalled();
    workExperience.findFirst.mockResolvedValueOnce(null);
    await expect(
      service.analyze('other', { experienceId: 'e' }),
    ).rejects.toMatchObject({ statusCode: 404 });
    workExperience.updateMany.mockResolvedValueOnce({ count: 0 });
    await expect(
      service.analyze('owner', { experienceId: 'e' }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });
  it('clears tags when description is empty', async () => {
    const { service } = setup(null);
    expect(
      (await service.analyze('owner', { experienceId: 'e' })).skills,
    ).toEqual([]);
  });
});
