import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service.js';
import { WorkExperienceNotFoundException } from '../../work-experience/exceptions/work-experience-not-found.exception.js';
import { WorkExperienceUpdateConflictException } from '../../work-experience/exceptions/work-experience-update-conflict.exception.js';
import { MatchingService } from './matching.service.js';
import type { AnalyzeExperienceInput } from '../types/matching.types.js';

@Injectable()
export class ExperienceAnalysisService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly matching: MatchingService,
  ) {}

  async analyze(userId: string, input: AnalyzeExperienceInput) {
    const record = await this.prisma.workExperience.findFirst({
      where: { id: input.experienceId, userId },
      select: { description: true },
    });
    if (!record) throw new WorkExperienceNotFoundException();
    if (input.text !== undefined && input.text !== record.description)
      throw new WorkExperienceUpdateConflictException();
    const result = this.matching.analyzeExperience({
      experienceId: input.experienceId,
      text: record.description,
    });
    const update = await this.prisma.workExperience.updateMany({
      where: {
        id: input.experienceId,
        userId,
        description: record.description,
      },
      data: { detectedSkills: result.skills.map(({ name }) => name) },
    });
    if (update.count !== 1) throw new WorkExperienceUpdateConflictException();
    return result;
  }
}
