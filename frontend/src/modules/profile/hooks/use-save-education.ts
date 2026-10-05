"use client";

import { useRef, useState } from "react";
import { EDUCATION_FEEDBACK_MESSAGES } from "../constants/education-feedback.constants";
import { educationsService } from "../services/educations.service";
import type { EducationPayload } from "../types/education-payload.types";
import type { Feedback } from "../types/feedback.types";

export function useSaveEducation(onSaved: () => void | Promise<void>) {
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const isSavingRef = useRef(false);

  async function save(payload: EducationPayload, id?: string): Promise<void> {
    if (isSavingRef.current) {
      return;
    }
    isSavingRef.current = true;
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
      await onSaved();
    } catch {
      setFeedback({
        type: "error",
        message: id ? EDUCATION_FEEDBACK_MESSAGES.updateError : EDUCATION_FEEDBACK_MESSAGES.createError,
      });
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  }

  function clearFeedback() {
    setFeedback(null);
  }

  return { save, isSaving, feedback, clearFeedback };
}
