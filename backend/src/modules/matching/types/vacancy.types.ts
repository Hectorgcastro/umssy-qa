export interface VacancyRecord {
  id: string;
  title: string;
  companyName: string;
  description: string;
  requiredSkills: string[];
  academicRequirements: string[];
  otherRequirements: string[];
  minExperienceYears: number;
}
