import { Injectable } from '@nestjs/common';
import { WorkExperienceNotFoundException } from '../exceptions/work-experience-not-found.exception.js';
import { WorkExperienceMapper } from '../mappers/work-experience.mapper.js';
import { WorkExperienceRepository } from '../repositories/work-experience.repository.js';
import type { CreateWorkExperienceRequest } from '../requests/create-work-experience.request.js';
import type { UpdateWorkExperienceRequest } from '../requests/update-work-experience.request.js';
import type { WorkExperienceResponse } from '../responses/work-experience.response.js';

@Injectable()
export class WorkExperienceService {
  constructor(
    private readonly repository: WorkExperienceRepository,
    private readonly mapper: WorkExperienceMapper,
  ) {}

  async findAll(userId: string): Promise<WorkExperienceResponse[]> {
    return this.mapper.toResponseList(
      await this.repository.findManyByUserId(userId),
    );
  }

  async create(
    userId: string,
    request: CreateWorkExperienceRequest,
  ): Promise<WorkExperienceResponse> {
    const record = await this.repository.create(userId, {
      ...request,
      endDate: request.endDate ?? null,
      description: request.description ?? null,
    });
    return this.mapper.toResponse(record);
  }

  async update(
    userId: string,
    id: string,
    request: UpdateWorkExperienceRequest,
  ): Promise<WorkExperienceResponse> {
    const updated = await this.repository.update(id, userId, request);
    if (!updated) {
      throw new WorkExperienceNotFoundException();
    }
    return this.mapper.toResponse(updated);
  }

  async remove(userId: string, id: string): Promise<void> {
    const deleted = await this.repository.delete(id, userId);
    if (!deleted) {
      throw new WorkExperienceNotFoundException();
    }
  }
}