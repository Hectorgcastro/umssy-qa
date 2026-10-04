"use client";

import { useCallback, useEffect, useState } from "react";
import { WORK_EXPERIENCE_FEEDBACK_MESSAGES } from "../config/work-experience-feedback.config";
import { workExperienceService } from "../services/work-experience.service";
import type { WorkExperienceItem } from "../types/work-experience-item.types";
import type { WorkExperiencesResult } from "../types/work-experiences-result.types";

async function requestWorkExperiences(): Promise<WorkExperiencesResult> {
  try {
    const experiences = await workExperienceService.getWorkExperiences();
    return { experiences, error: null };
  } catch {
    return { experiences: null, error: WORK_EXPERIENCE_FEEDBACK_MESSAGES.loadError };
  }
}

export function useWorkExperiences() {
  const [experiences, setExperiences] = useState<WorkExperienceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyResult = useCallback((result: WorkExperiencesResult) => {
    if (result.experiences) {
      setExperiences(result.experiences);
    }
    setError(result.error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isActive = true;
    void requestWorkExperiences().then((result) => {
      if (isActive) {
        applyResult(result);
      }
    });
    return () => {
      isActive = false;
    };
  }, [applyResult]);

  const reload = useCallback(async () => {
    setIsLoading(true);
    applyResult(await requestWorkExperiences());
  }, [applyResult]);

  return { experiences, isLoading, error, reload };
}
