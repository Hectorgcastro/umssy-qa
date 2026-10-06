export interface WorkExperienceResponse {
  detectedSkills?: string[];
  processingTimeMs?: number;
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
