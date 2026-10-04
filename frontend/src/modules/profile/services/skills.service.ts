import { apiClient } from "@/shared/services/api-client";
import {
  CUSTOM_SKILL_ENDPOINT,
  MY_SKILLS_ENDPOINT,
  SKILLS_CATALOG_ENDPOINT,
} from "../config/skills-api.config";
import type { ApiResponse } from "../types/api-response.types";
import type { SkillItem } from "../types/skill-item.types";
import type { SkillResponse } from "../types/skill-response.types";
import { toSkillItem } from "../utils/to-skill-item";

export const skillsService = {
  getCatalog: async (): Promise<SkillItem[]> => {
    const response = await apiClient.get<ApiResponse<SkillResponse[]>>(SKILLS_CATALOG_ENDPOINT);
    return response.data.data.map(toSkillItem);
  },

  getMySkills: async (): Promise<SkillItem[]> => {
    const response = await apiClient.get<ApiResponse<SkillResponse[]>>(MY_SKILLS_ENDPOINT);
    return response.data.data.map(toSkillItem);
  },

  createCustomSkill: async (name: string): Promise<SkillItem> => {
    const response = await apiClient.post<ApiResponse<SkillResponse>>(CUSTOM_SKILL_ENDPOINT, {
      name,
    });
    return toSkillItem(response.data.data);
  },

  saveMySkills: async (skillIds: string[]): Promise<SkillItem[]> => {
    const response = await apiClient.put<ApiResponse<SkillResponse[]>>(MY_SKILLS_ENDPOINT, {
      skillIds,
    });
    return response.data.data.map(toSkillItem);
  },
};
