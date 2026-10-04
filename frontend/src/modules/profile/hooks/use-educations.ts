"use client";

import { useEffect, useState } from "react";
import { EDUCATION_FEEDBACK_MESSAGES } from "../config/education-feedback.config";
import { educationsService } from "../services/educations.service";
import type { EducationItem } from "../types/education-item.types";

export function useEducations() {
  const [educations, setEducations] = useState<EducationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadEducations() {
      try {
        const records = await educationsService.getEducations();
        if (isActive) {
          setEducations(records);
        }
      } catch {
        if (isActive) {
          setError(EDUCATION_FEEDBACK_MESSAGES.loadError);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadEducations();

    return () => {
      isActive = false;
    };
  }, []);

  return { educations, isLoading, error };
}
