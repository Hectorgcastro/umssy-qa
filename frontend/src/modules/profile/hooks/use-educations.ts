"use client";

import { useCallback, useEffect, useState } from "react";
import { EDUCATION_FEEDBACK_MESSAGES } from "../config/education-feedback.config";
import { educationsService } from "../services/educations.service";
import type { EducationItem } from "../types/education-item.types";
import type { EducationsResult } from "../types/educations-result.types";

async function requestEducations(): Promise<EducationsResult> {
  try {
    const educations = await educationsService.getEducations();
    return { educations, error: null };
  } catch {
    return { educations: null, error: EDUCATION_FEEDBACK_MESSAGES.loadError };
  }
}

export function useEducations() {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const applyResult = useCallback((result: EducationsResult) => {
    if (result.educations) {
      setEducations(result.educations);
    }
    setError(result.error);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let isActive = true;
    void requestEducations().then((result) => {
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
    applyResult(await requestEducations());
  }, [applyResult]);

  return { educations, isLoading, error, reload };
}
