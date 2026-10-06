export interface DetectedSkillResponse {
  id: string;
  name: string;
}

export interface AnalyzeExperienceInput {
  experienceId: string;
  text?: string | null;
}

export interface AnalyzeExperienceResponse {
  experienceId: string;
  skills: DetectedSkillResponse[];
  processingTimeMs: number;
}
