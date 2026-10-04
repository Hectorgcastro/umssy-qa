"use client";

import { useState } from "react";
import { EDUCATION_FEEDBACK_MESSAGES } from "../constants/education-feedback.constants";
import { educationsService } from "../services/educations.service";
import type { EducationItem } from "../types/education-item.types";
import type { Feedback } from "../types/feedback.types";

export function useDeleteEducation(onDeleted: () => void) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function deleteEducation(education: EducationItem): Promise<void> {
    setIsDeleting(true);
    setFeedback(null);
    try {
      await educationsService.deleteEducation(education.id);
      setFeedback({ type: "success", message: EDUCATION_FEEDBACK_MESSAGES.deleteSuccess });
      onDeleted();
    } catch {
      setFeedback({ type: "error", message: EDUCATION_FEEDBACK_MESSAGES.deleteError });
    } finally {
      setIsDeleting(false);
    }
  }

  function clearFeedback() {
    setFeedback(null);
  }

  return { deleteEducation, isDeleting, feedback, clearFeedback };
}
