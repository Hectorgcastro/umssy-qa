import type { MentorGuidanceType } from "./mentor-guidance-type.types";

export interface MentorProfile {
  id: string;
  fullName: string;
  headline: string | null;
  aboutMe: string | null;
  photoUrl: string | null;
  city: {
    id: string;
    title: string;
  } | null;
  educations: Array<{
    id: string;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string | null;
    description: string | null;
  }>;
  workExperiences: Array<{
    id: string;
    position: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    description: string | null;
    company: {
      id: string;
      title: string;
    };
  }>;
  skills: Array<{
    id: string;
    name: string;
    isCustom: boolean;
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    documentUrl: string | null;
  }>;
  technicalAreas: Array<{
    id: string;
    name: string;
    description: string | null;
  }>;
  orientationTypes: MentorGuidanceType[];
}
