import { Injectable } from '@nestjs/common';
import { MentorsRepository } from '../repositories/mentors.repository.js';
import {
  AlreadyMentorException,
  InvalidOrientationTypesException,
  InvalidTechnicalAreasException,
  MentorRoleNotFoundException,
} from '../exceptions/index.js';
import type { ActivateMentorDto } from '../requests/activate-mentor.schema.js';

@Injectable()
export class MentorsService {
  constructor(
    private readonly mentorsRepository: MentorsRepository,
  ) {}

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
