import type { RequirementState } from "./requirement-state.types";

export interface GapAnalysis {
  skills: RequirementState[];
  academicRequirements: RequirementState[];
  otherRequirements: RequirementState[];
  experienceRequirements: RequirementState[];
  missingSkills: string[];
  complete: boolean;
  message: string | null;
}
