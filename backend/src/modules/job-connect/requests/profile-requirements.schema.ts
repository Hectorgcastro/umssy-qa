import { z } from 'zod';

const requirementList = z.array(z.string().trim().min(1).max(200)).max(200);
export const profileRequirementsSchema = z.object({
  skills: requirementList,
  academicQualifications: requirementList.default([]),
  submittedRequirements: requirementList.default([]),
});
