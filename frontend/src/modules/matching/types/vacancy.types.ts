import type { GapAnalysis } from "./gap-analysis.types";

export interface Vacancy {
  id: string;
  title: string;
  companyName: string;
  description: string;
  compatibility: number;
  gap: GapAnalysis;
}
