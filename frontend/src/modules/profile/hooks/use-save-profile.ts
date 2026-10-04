"use client";

import { useState } from "react";
import { PROFILE_FEEDBACK_MESSAGES } from "../config/profile-feedback.config";
import { profileService } from "../services/profile.service";
import type { Feedback } from "../types/feedback.types";
import type { PersonalInfoValues } from "../types/personal-info-values.types";
import type { PresentationPayload } from "../types/presentation-payload.types";
import type { ProfileResponse } from "../types/profile-response.types";
import { getProfileErrorMessage } from "../utils/get-profile-error-message";

export function useSaveProfile(onSaved: (profile: ProfileResponse) => void) {
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  async function save(request: () => Promise<ProfileResponse>, successMessage: string) {
    setIsSaving(true);
    setFeedback(null);
    try {
      onSaved(await request());
      setFeedback({ type: "success", message: successMessage });
      return true;
    } catch (error) {
      setFeedback({
        type: "error",
        message: getProfileErrorMessage(error, PROFILE_FEEDBACK_MESSAGES.saveError),
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function savePersonalInfo(values: PersonalInfoValues): Promise<boolean> {
    return save(
      () => profileService.updatePersonalInfo(values),
      PROFILE_FEEDBACK_MESSAGES.personalInfoSaveSuccess,
    );
  }

  function savePresentation(payload: PresentationPayload): Promise<boolean> {
    return save(
      () => profileService.updatePresentation(payload),
      PROFILE_FEEDBACK_MESSAGES.presentationSaveSuccess,
    );
  }

  return { savePersonalInfo, savePresentation, isSaving, feedback };
}
