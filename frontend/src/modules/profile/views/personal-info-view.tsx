"use client";

import { FeedbackMessage } from "../components/feedback-message";
import { PersonalInfoForm } from "../components/personal-info-form";
import { ProfilePageLayout } from "../components/profile-page-layout";
import { PROFILE_FEEDBACK_MESSAGES } from "../config/profile-feedback.config";
import { useCities } from "../hooks/use-cities";
import { useProfile } from "../hooks/use-profile";
import { useProfilePhoto } from "../hooks/use-profile-photo";
import { useSaveProfile } from "../hooks/use-save-profile";
import type { PersonalInfoValues } from "../types/personal-info-values.types";
import { toPersonalInfoValues } from "../utils/to-personal-info-values";

export function PersonalInfoView() {
  const { profile, isLoading, error: loadError, setProfile } = useProfile();
  const { cities, error: citiesError } = useCities();
  const { savePersonalInfo, isSaving, feedback } = useSaveProfile(setProfile);
  const { photoUrl, isUploading, error: photoError, uploadPhoto } = useProfilePhoto();

  const handleSubmit = (values: PersonalInfoValues) => {
    void savePersonalInfo(values);
  };

  return (
    <ProfilePageLayout
      activeTab="personal-info"
      title="Datos personales y contacto"
      description="Registra tu información para que la comunidad pueda identificarte y contactarte."
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
          <FeedbackMessage
            feedback={citiesError ? { type: "error", message: citiesError } : null}
          />
          <PersonalInfoForm
            initialValues={toPersonalInfoValues(profile)}
            cities={cities}
            isSaving={isSaving}
            photo={{ photoUrl, isUploading, error: photoError, onSelectPhoto: uploadPhoto }}
            onSubmit={handleSubmit}
          />
        </>
      ) : null}
    </ProfilePageLayout>
  );
}
