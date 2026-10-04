import type { MentorGuidanceType } from "./mentor-guidance-type.types";

export interface MentorProfile {
  id: number;
  name: string;
  specialty: string;
  professionalInterests: string[];
  position: string;
  company: string;
  yearsExperience: number;
  faculty: string;
  program: string;
  description: string;
  profileImage?: string;
  isAvailable: boolean;
  technicalAreas: string[];
  guidanceTypes: MentorGuidanceType[];
}
