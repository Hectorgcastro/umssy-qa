import { Injectable } from '@nestjs/common';
import { MatchingService } from '../../matching/services/matching.service.js';
import type { WorkExperienceResponse } from '../responses/work-experience.response.js';
import type { WorkExperienceRecord } from '../types/work-experience-record.type.js';

@Injectable()
export class WorkExperienceMapper {
  constructor(
    private readonly matching: MatchingService = new MatchingService(),
  ) {}
  toResponse(record: WorkExperienceRecord): WorkExperienceResponse {
    return {
      id: record.id,
      ...(record.detectedSkills === undefined
        ? {}
        : {
            detectedSkills: record.detectedSkills,
            processingTimeMs: this.matching.analyzeExperience({
              experienceId: record.id,
              text: record.description,
            }).processingTimeMs,
          }),
      companyName: record.company.title,
      position: record.position,
      startDate: record.startDate.toISOString().slice(0, 10),
      endDate: record.endDate?.toISOString().slice(0, 10) ?? null,
      isCurrent: record.isCurrent,
      description: record.description,
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  toResponseList(records: WorkExperienceRecord[]): WorkExperienceResponse[] {
    return records.map((record) => this.toResponse(record));
  }
}
