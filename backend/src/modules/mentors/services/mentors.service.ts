import { Injectable } from '@nestjs/common';
import { MentorsRepository } from '../repositories/mentors.repository.js';
import {
  AlreadyMentorException,
  InvalidOrientationTypesException,
  InvalidTechnicalAreasException,
  MentorNotFoundException,
  MentorRoleNotFoundException,
} from '../exceptions/index.js';
import type { ActivateMentorDto } from '../requests/activate-mentor.schema.js';
import type { UpdateMentorTechnicalAreasDto } from '../requests/update-mentor-technical-areas.schema.js';
import type { UpdateMentorOrientationTypesDto } from '../requests/update-mentor-orientation-types.schema.js';
import type { MentorDirectoryResponse } from '../types/mentor-directory-response.types.js';
import type { MentorProfileResponse } from '../types/mentor-profile-response.types.js';
import type { TechnicalAreaResponse } from '../../technical-areas/types/technical-area-response.types.js';
import type { OrientationTypeResponse } from '../../orientation-types/types/orientation-type-response.types.js';

@Injectable()
export class MentorsService {
  constructor(private readonly mentorsRepository: MentorsRepository) {}

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

  async findOne(userId: string): Promise<MentorProfileResponse> {
    const now = new Date();
    const mentor = await this.mentorsRepository.findActiveMentorById(
      userId,
      now,
    );

    if (!mentor) {
      throw new MentorNotFoundException();
    }

    return {
      id: mentor.id,
      fullName: `${mentor.firstName} ${mentor.lastName}`,
      headline: mentor.headline,
      aboutMe: mentor.aboutMe,
      photoUrl: this.bytesToString(mentor.photoUrl),
      city: mentor.city,
      educations: mentor.educations,
      workExperiences: mentor.workExperiences,
      skills: mentor.userSkills.map((relation) => relation.skill),
      certifications: mentor.certifications.map((certification) => ({
        ...certification,
        documentUrl: this.bytesToString(certification.documentUrl),
      })),
      technicalAreas: mentor.mentorTechnicalAreas.map(
        (relation) => relation.technicalArea,
      ),
      orientationTypes: mentor.mentorOrientationTypes.map(
        (relation) => relation.orientationType,
      ),
    };
  }

  async findMyTechnicalAreas(userId: string): Promise<TechnicalAreaResponse[]> {
    await this.assertActiveMentor(userId);
    const relations =
      await this.mentorsRepository.findMentorTechnicalAreas(userId);

    return relations.map((relation) => relation.technicalArea);
  }

  async updateMyTechnicalAreas(
    userId: string,
    data: UpdateMentorTechnicalAreasDto,
  ) {
    await this.assertActiveMentor(userId);
    const technicalAreas = await this.mentorsRepository.findTechnicalAreas(
      data.technicalAreaIds,
    );

    if (technicalAreas.length !== data.technicalAreaIds.length) {
      throw new InvalidTechnicalAreasException();
    }

    await this.mentorsRepository.replaceMentorTechnicalAreas(
      userId,
      data.technicalAreaIds,
    );

    return { technicalAreaIds: data.technicalAreaIds };
  }

  async findMyOrientationTypes(
    userId: string,
  ): Promise<OrientationTypeResponse[]> {
    await this.assertActiveMentor(userId);
    const relations =
      await this.mentorsRepository.findMentorOrientationTypes(userId);

    return relations.map((relation) => relation.orientationType);
  }

  async updateMyOrientationTypes(
    userId: string,
    data: UpdateMentorOrientationTypesDto,
  ) {
    await this.assertActiveMentor(userId);
    const orientationTypes =
      await this.mentorsRepository.findActiveOrientationTypes(
        data.orientationTypeIds,
      );

    if (orientationTypes.length !== data.orientationTypeIds.length) {
      throw new InvalidOrientationTypesException();
    }

    await this.mentorsRepository.replaceMentorOrientationTypes(
      userId,
      data.orientationTypeIds,
    );

    return { orientationTypeIds: data.orientationTypeIds };
  }

  async activate(userId: string, data: ActivateMentorDto) {
    const mentorRole = await this.mentorsRepository.findMentorRole();

    if (!mentorRole) {
      throw new MentorRoleNotFoundException();
    }

    const existingRole = await this.mentorsRepository.findActiveUserRole(
      userId,
      mentorRole.id,
    );

    if (existingRole) {
      throw new AlreadyMentorException();
    }

    const technicalAreas = await this.mentorsRepository.findTechnicalAreas(
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

  private bytesToString(value: Uint8Array | null): string | null {
    return value ? Buffer.from(value).toString('utf8') : null;
  }

  private async assertActiveMentor(userId: string): Promise<void> {
    const mentor = await this.mentorsRepository.findActiveMentorParticipation(
      userId,
      new Date(),
    );

    if (!mentor) {
      throw new MentorNotFoundException();
    }
  }
}
