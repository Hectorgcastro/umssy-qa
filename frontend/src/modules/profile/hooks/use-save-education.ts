"use client";

import { useState } from "react";
import { EDUCATION_FEEDBACK_MESSAGES } from "../config/education-feedback.config";
import { educationsService } from "../services/educations.service";
import type { EducationPayload } from "../types/education-payload.types";
import type { Feedback } from "../types/feedback.types";

export function useSaveEducation(onSaved: () => void) {
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function save(payload: EducationPayload, id?: string): Promise<void> {
    setIsSaving(true);
    setFeedback(null);
    try {
      if (id) {
        await educationsService.updateEducation(id, payload);
      } else {
        await educationsService.createEducation(payload);
      }
      setFeedback({
        type: "success",
        message: id
          ? EDUCATION_FEEDBACK_MESSAGES.updateSuccess
          : EDUCATION_FEEDBACK_MESSAGES.createSuccess,
      });
      onSaved();
    } catch {
      setFeedback({
        type: "error",
        message: id ? EDUCATION_FEEDBACK_MESSAGES.updateError : EDUCATION_FEEDBACK_MESSAGES.createError,
      });
    } finally {
      setIsSaving(false);
    }
  }

  function clearFeedback() {
    setFeedback(null);
  }

  return { save, isSaving, feedback, clearFeedback };
}
