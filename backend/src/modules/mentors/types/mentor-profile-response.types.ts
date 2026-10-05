import type { TechnicalAreaResponse } from '../../technical-areas/types/technical-area-response.types.js';
import type { OrientationTypeResponse } from '../../orientation-types/types/orientation-type-response.types.js';

interface MentorProfileCity {
  id: string;
  title: string;
}

interface MentorProfileEducation {
  id: string;
  institution: string;
  degree: string;
  startDate: Date;
  endDate: Date | null;
  description: string | null;
}

interface MentorProfileCompany {
  id: string;
  title: string;
}

interface MentorProfileWorkExperience {
  id: string;
  position: string;
  startDate: Date;
  endDate: Date | null;
  isCurrent: boolean;
  description: string | null;
  company: MentorProfileCompany;
}

interface MentorProfileSkill {
  id: string;
  name: string;
  isCustom: boolean;
}

interface MentorProfileCertification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: Date;
  documentUrl: string | null;
}

export interface MentorProfileResponse {
  id: string;
  fullName: string;
  headline: string | null;
  aboutMe: string | null;
  photoUrl: string | null;
  city: MentorProfileCity | null;
  educations: MentorProfileEducation[];
  workExperiences: MentorProfileWorkExperience[];
  skills: MentorProfileSkill[];
  certifications: MentorProfileCertification[];
  technicalAreas: TechnicalAreaResponse[];
  orientationTypes: OrientationTypeResponse[];
}
