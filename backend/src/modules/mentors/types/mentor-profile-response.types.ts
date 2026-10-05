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

interface MentorProfileTechnicalArea {
  id: string;
  name: string;
  description: string | null;
}

interface MentorProfileOrientationType {
  id: string;
  name: string;
  description: string | null;
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
  technicalAreas: MentorProfileTechnicalArea[];
  orientationTypes: MentorProfileOrientationType[];
}
