export interface MentorDirectoryItem {
  id: string;
  fullName: string;
  jobTitle: string | null;
  technicalAreas: string[];
  isAvailable: boolean;
}