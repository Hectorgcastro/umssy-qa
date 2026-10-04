"use client";

import { useState } from "react";
import { FeedbackMessage } from "../components/feedback-message";
import { PresentationForm } from "../components/presentation-form";
import { ProfilePageLayout } from "../components/profile-page-layout";
import { PROFILE_FEEDBACK_MESSAGES } from "../config/profile-feedback.config";
import { useProfile } from "../hooks/use-profile";
import { useProfilePhoto } from "../hooks/use-profile-photo";
import { useSaveProfile } from "../hooks/use-save-profile";
import type { PresentationValues } from "../types/presentation-values.types";
import { getFullName } from "../utils/get-full-name";
import { toPresentationValues } from "../utils/to-presentation-values";

export function PresentationView() {
  const { profile, isLoading, error: loadError, setProfile } = useProfile();
  const { savePresentation, isSaving, feedback } = useSaveProfile(setProfile);
  const { photoUrl } = useProfilePhoto();
  // Kept in the page until the users.interested_opportunities column exists.
  const [interestedOpportunities, setInterestedOpportunities] = useState("");

  const handleSubmit = async (values: PresentationValues) => {
    const isSaved = await savePresentation({
      headline: values.headline,
      aboutMe: values.aboutMe,
    });
    if (isSaved) {
      setInterestedOpportunities(values.interestedOpportunities);
    }
  };

  return (
    <ProfilePageLayout
      activeTab="presentation"
      title="Presentación profesional"
      description="Escribe cómo quieres presentarte ante egresados, mentores y empresas."
    >
      {isLoading ? (
        <p role="status" className="text-[15px] text-text-secondary">
          {PROFILE_FEEDBACK_MESSAGES.loading}
        </p>
      ) : null}

      {!isLoading && !profile ? (
        <FeedbackMessage
          feedback={{ type: "error", message: loadError ?? PROFILE_FEEDBACK_MESSAGES.loadError }}
        />
      ) : null}

      {profile ? (
        <>
          <FeedbackMessage feedback={feedback} />
          <PresentationForm
            initialValues={{ ...toPresentationValues(profile), interestedOpportunities }}
            fullName={getFullName(profile)}
            photoUrl={photoUrl}
            isSaving={isSaving}
            onSubmit={(values) => void handleSubmit(values)}
          />
        </>
      ) : null}
    </ProfilePageLayout>
  );
}
