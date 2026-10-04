import type { WorkExperienceItem } from "./work-experience-item.types";

export interface WorkExperienceListCardProps {
  experiences?: WorkExperienceItem[];
  isLoading?: boolean;
  onEdit?: (experience: WorkExperienceItem) => void;
}
