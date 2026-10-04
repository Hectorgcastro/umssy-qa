"use client";

import { useEffect, useState } from "react";
import { PENDING_SKILL_ID_PREFIX } from "../config/skills-api.config";
import { SKILLS_ERROR_MESSAGES, SKILLS_SUCCESS_MESSAGES } from "../config/skills-messages.config";
import { skillsService } from "../services/skills.service";
import type { Feedback } from "../types/feedback.types";
import type { SkillItem } from "../types/skill-item.types";
import type { UseSkillsResult } from "../types/use-skills-result.types";
import { getSkillsErrorMessage } from "../utils/get-skills-error-message";

function resolveSkill(skill: SkillItem): Promise<SkillItem> {
  if (skill.id.startsWith(PENDING_SKILL_ID_PREFIX)) {
    return skillsService.createCustomSkill(skill.name);
  }

  return Promise.resolve(skill);
}

export function useSkills(): UseSkillsResult {
  const [catalogSkills, setCatalogSkills] = useState<SkillItem[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<SkillItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadSkills() {
      try {
        const [catalog, mySkills] = await Promise.all([
          skillsService.getCatalog(),
          skillsService.getMySkills(),
        ]);
        if (isActive) {
          setCatalogSkills(catalog);
          setSelectedSkills(mySkills);
        }
      } catch (error) {
        if (isActive) {
          setFeedback({
            type: "error",
            message: getSkillsErrorMessage(error, SKILLS_ERROR_MESSAGES.load),
          });
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadSkills();

    return () => {
      isActive = false;
    };
  }, []);

  function addSkill(skill: SkillItem): void {
    setSelectedSkills((current) =>
      current.some((selected) => selected.id === skill.id) ? current : [...current, skill],
    );
    setFeedback(null);
  }

  function removeSkill(skillId: string): void {
    setSelectedSkills((current) => current.filter((skill) => skill.id !== skillId));
    setFeedback(null);
  }

  function createCustomSkill(name: string): void {
    addSkill({ id: `${PENDING_SKILL_ID_PREFIX}${name.toLowerCase()}`, name });
  }

  async function saveSkills(): Promise<void> {
    setIsSaving(true);
    setFeedback(null);

    try {
      const resolvedSkills = await Promise.all(selectedSkills.map(resolveSkill));
      const skillIds = [...new Set(resolvedSkills.map((skill) => skill.id))];
      const savedSkills = await skillsService.saveMySkills(skillIds);
      setSelectedSkills(savedSkills);
      setFeedback({ type: "success", message: SKILLS_SUCCESS_MESSAGES.saved });
    } catch (error) {
      setFeedback({
        type: "error",
        message: getSkillsErrorMessage(error, SKILLS_ERROR_MESSAGES.save),
      });
    } finally {
      setIsSaving(false);
    }
  }

  return {
    catalogSkills,
    selectedSkills,
    isLoading,
    isSaving,
    feedback,
    addSkill,
    removeSkill,
    createCustomSkill,
    saveSkills,
  };
}
