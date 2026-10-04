"use client";

import { useState } from "react";
import { FeedbackMessage } from "../components/feedback-message";
import { ProfilePageLayout } from "../components/profile-page-layout";
import { TrajectorySteps } from "../components/trajectory-steps";
import { WorkExperienceForm } from "../components/work-experience-form";
import { WorkExperienceListCard } from "../components/work-experience-list-card";
import { useSaveWorkExperience } from "../hooks/use-save-work-experience";
import { useWorkExperiences } from "../hooks/use-work-experiences";
import type { Feedback } from "../types/feedback.types";
import type { WorkExperienceFormValues } from "../types/work-experience-form-values.types";
import type { WorkExperienceItem } from "../types/work-experience-item.types";
import { toWorkExperienceFormValues } from "../utils/to-work-experience-form-values";
import { toWorkExperiencePayload } from "../utils/to-work-experience-payload";

export function WorkExperienceView() {
  const { experiences, isLoading, error, reload } = useWorkExperiences();
  const [editingExperience, setEditingExperience] = useState<WorkExperienceItem | null>(null);
  const [formVersion, setFormVersion] = useState(0);

  const resetForm = () => {
    setEditingExperience(null);
    setFormVersion((version) => version + 1);
  };

  const { save, isSaving, feedback, clearFeedback } = useSaveWorkExperience(() => {
    resetForm();
    void reload();
  });

  const visibleFeedback: Feedback | null =
    feedback ?? (error ? { type: "error", message: error } : null);

  const handleEdit = (experience: WorkExperienceItem) => {
    clearFeedback();
    setEditingExperience(experience);
  };

  const handleSubmit = async (values: WorkExperienceFormValues) => {
    await save(toWorkExperiencePayload(values), editingExperience?.id);
  };

  return (
    <ProfilePageLayout
      activeTab="trajectory"
      title="Trayectoria"
      description="Muestra tus estudios, experiencia, habilidades y certificaciones"
    >
      <TrajectorySteps activeStep="experience" />
      {visibleFeedback ? <FeedbackMessage feedback={visibleFeedback} /> : null}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        <WorkExperienceListCard
          experiences={experiences}
          isLoading={isLoading}
          onEdit={handleEdit}
        />
        <WorkExperienceForm
          key={editingExperience ? editingExperience.id : `new-${formVersion}`}
          initialValues={
            editingExperience ? toWorkExperienceFormValues(editingExperience) : undefined
          }
          isPending={isSaving}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </div>
    </ProfilePageLayout>
  );
}
