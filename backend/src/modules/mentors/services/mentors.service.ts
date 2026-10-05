import { Injectable } from '@nestjs/common';
import { MentorsRepository } from '../repositories/mentors.repository.js';
import {
  AlreadyMentorException,
  InvalidOrientationTypesException,
  InvalidTechnicalAreasException,
  MentorRoleNotFoundException,
} from '../exceptions/index.js';
import type { ActivateMentorDto } from '../requests/activate-mentor.schema.js';
import type { MentorDirectoryResponse } from '../types/mentor-directory-response.types.js';

@Injectable()
export class MentorsService {
  constructor(
    private readonly mentorsRepository: MentorsRepository,
  ) {}

  async findAll(): Promise<MentorDirectoryResponse[]> {
    const now = new Date();
    const mentors = await this.mentorsRepository.findActiveMentors(now);

    return mentors.map((mentor) => ({
      id: mentor.id,
      fullName: `${mentor.firstName} ${mentor.lastName}`,
      headline: mentor.headline,
      technicalAreas: mentor.mentorTechnicalAreas.map(
        (relation) => relation.technicalArea.name,
      ),
    }));
  }

  async activate(
    userId: string,
    data: ActivateMentorDto,
  ) {
    const mentorRole = await this.mentorsRepository.findMentorRole();

    if (!mentorRole) {
      throw new MentorRoleNotFoundException();
    }

    const existingRole =
      await this.mentorsRepository.findActiveUserRole(
        userId,
        mentorRole.id,
      );

    if (existingRole) {
      throw new AlreadyMentorException();
    }

    const technicalAreas =
      await this.mentorsRepository.findTechnicalAreas(
        data.technicalAreaIds,
      );

    if (technicalAreas.length !== data.technicalAreaIds.length) {
      throw new InvalidTechnicalAreasException();
    }

    const orientationTypes =
      await this.mentorsRepository.findActiveOrientationTypes(
        data.orientationTypeIds,
      );

    if (orientationTypes.length !== data.orientationTypeIds.length) {
      throw new InvalidOrientationTypesException();
    }

    return this.mentorsRepository.activate(
      userId,
      mentorRole.id,
      data.technicalAreaIds,
      data.orientationTypeIds,
    );
  }
}