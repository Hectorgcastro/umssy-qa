"use client";

import { useState } from "react";
import { ConfirmDeleteDialog } from "../components/confirm-delete-dialog";
import { EducationForm } from "../components/education-form";
import { EducationListCard } from "../components/education-list-card";
import { FeedbackMessage } from "../components/feedback-message";
import { ProfilePageLayout } from "../components/profile-page-layout";
import { TrajectorySteps } from "../components/trajectory-steps";
import { useDeleteEducation } from "../hooks/use-delete-education";
import { useEducations } from "../hooks/use-educations";
import { useSaveEducation } from "../hooks/use-save-education";
import type { EducationFormValues } from "../types/education-form-values.types";
import type { EducationItem } from "../types/education-item.types";
import { toEducationFormValues } from "../utils/to-education-form-values";
import { toEducationPayload } from "../utils/to-education-payload";

export function EducationView() {
  const { educations, isLoading, error, reload } = useEducations();
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);
  const [pendingDelete, setPendingDelete] = useState<EducationItem | null>(null);
  const [formVersion, setFormVersion] = useState(0);

  const resetForm = () => {
    setEditingEducation(null);
    setFormVersion((version) => version + 1);
  };

  const saveMutation = useSaveEducation(() => {
    resetForm();
    void reload();
  });

  const deleteMutation = useDeleteEducation(() => {
    void reload();
  });

  const handleEdit = (education: EducationItem) => {
    saveMutation.clearFeedback();
    deleteMutation.clearFeedback();
    setEditingEducation(education);
  };

  const handleDelete = (education: EducationItem) => {
    saveMutation.clearFeedback();
    deleteMutation.clearFeedback();
    setPendingDelete(education);
  };

  const handleSubmit = async (values: EducationFormValues) => {
    deleteMutation.clearFeedback();
    await saveMutation.save(toEducationPayload(values), editingEducation?.id);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }
    await deleteMutation.deleteEducation(pendingDelete);
    if (editingEducation?.id === pendingDelete.id) {
      resetForm();
    }
    setPendingDelete(null);
  };

  return (
    <ProfilePageLayout
      activeTab="trajectory"
      title="Trayectoria"
      description="Muestra tus estudios, experiencia, habilidades y certificaciones"
    >
      <TrajectorySteps activeStep="education" />
      <FeedbackMessage feedback={deleteMutation.feedback} />
      <div className="grid grid-cols-2 items-start gap-6">
        <EducationListCard
          educations={educations}
          isLoading={isLoading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <EducationForm
          key={editingEducation ? editingEducation.id : `new-${formVersion}`}
          initialValues={editingEducation ? toEducationFormValues(editingEducation) : undefined}
          isPending={saveMutation.isSaving}
          feedback={saveMutation.feedback}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />
      </div>
      <ConfirmDeleteDialog
        isOpen={pendingDelete !== null}
        title="¿Eliminar esta formación?"
        message={
          pendingDelete
            ? `Se eliminará "${pendingDelete.degree}" de tu trayectoria. Esta acción no se puede deshacer.`
            : ""
        }
        isDeleting={deleteMutation.isDeleting}
        onConfirm={() => void handleConfirmDelete()}
        onCancel={() => setPendingDelete(null)}
      />
    </ProfilePageLayout>
  );
}
