"use client";

import { useState } from "react";
import { Award, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CertificationCard } from "../components/certification-card";
import { CertificationDeleteDialog } from "../components/certification-delete-dialog";
import { CertificationForm } from "../components/certification-form";
import { FeedbackMessage } from "../components/feedback-message";
import { ProfilePageLayout } from "../components/profile-page-layout";
import { SectionCard } from "../components/section-card";
import { TrajectorySteps } from "../components/trajectory-steps";
import { CERTIFICATIONS_VIEW_TEXTS } from "../config/certifications-view.config";
import { PRIMARY_BUTTON_CLASS } from "../config/form-styles.config";
import { useCreateCertification, useUpdateCertification } from "../hooks/use-certification-mutations";
import { useCertifications } from "../hooks/use-certifications";
import { useDeleteCertification } from "../hooks/use-delete-certification";
import type { CertificationFormState } from "../types/certification-form-state.types";
import type { Certification, CreateCertificationDto } from "../types/certification.types";
import type { Feedback } from "../types/feedback.types";

function toFormValues(certification: Certification): CreateCertificationDto {
  return {
    name: certification.name,
    issuingOrganization: certification.issuingOrganization,
    issueDate: certification.issueDate,
  };
}

export function CertificationsView() {
  const { certifications, isLoading, error, reload } = useCertifications();
  const [formState, setFormState] = useState<CertificationFormState>({ mode: "closed" });
  const [pendingDelete, setPendingDelete] = useState<Certification | null>(null);

  const handleSaved = () => {
    setFormState({ mode: "closed" });
    void reload();
  };

  const createMutation = useCreateCertification({ onSuccess: handleSaved });
  const updateMutation = useUpdateCertification({ onSuccess: handleSaved });
  const deleteMutation = useDeleteCertification(() => {
    void reload();
  });

  const isFormOpen = formState.mode !== "closed";
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const visibleFeedback: Feedback | null =
    createMutation.feedback ??
    updateMutation.feedback ??
    deleteMutation.feedback ??
    (error ? { type: "error", message: error } : null);

  const clearFeedback = () => {
    createMutation.clearFeedback();
    updateMutation.clearFeedback();
    deleteMutation.clearFeedback();
  };

  const openCreateForm = () => {
    clearFeedback();
    setFormState({ mode: "create" });
  };

  const openEditForm = (certification: Certification) => {
    clearFeedback();
    setFormState({ mode: "edit", certification });
  };

  const closeForm = () => {
    setFormState({ mode: "closed" });
  };

  const handleSubmit = async (values: CreateCertificationDto) => {
    if (formState.mode === "edit") {
      await updateMutation.mutate({ id: formState.certification.id, data: values });
      return;
    }
    await createMutation.mutate(values);
  };

  const openDeleteDialog = (certification: Certification) => {
    clearFeedback();
    setPendingDelete(certification);
  };

  const closeDeleteDialog = () => {
    setPendingDelete(null);
  };

  const handleConfirmDelete = async (certification: Certification) => {
    await deleteMutation.deleteCertification(certification);
    setPendingDelete(null);
  };

  const addButton = (
    <Button type="button" className={cn(PRIMARY_BUTTON_CLASS, "gap-2")} onClick={openCreateForm}>
      <Plus aria-hidden="true" className="size-4" />
      {CERTIFICATIONS_VIEW_TEXTS.addButton}
    </Button>
  );

  const renderList = () => {
    if (isLoading) {
      return <p className="text-[14px] text-text-secondary">{CERTIFICATIONS_VIEW_TEXTS.loading}</p>;
    }

    if (certifications.length === 0) {
      return error ? null : (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border-strong px-8 py-12 text-center">
          <span className="flex size-12 items-center justify-center rounded-full bg-surface-soft text-ink-soft">
            <Award aria-hidden="true" className="size-6" />
          </span>
          <div className="flex flex-col gap-1">
            <h3 className="text-[16px] font-bold text-ink">{CERTIFICATIONS_VIEW_TEXTS.emptyTitle}</h3>
            <p className="max-w-md text-[14px] text-text-secondary">
              {CERTIFICATIONS_VIEW_TEXTS.emptyDescription}
            </p>
          </div>
          {addButton}
        </div>
      );
    }

    return (
      <ul aria-label={CERTIFICATIONS_VIEW_TEXTS.sectionTitle} className="flex flex-col gap-3">
        {certifications.map((certification) => (
          <li key={certification.id}>
            <CertificationCard
              certification={certification}
              isBusy={deleteMutation.isDeleting}
              onEdit={openEditForm}
              onDelete={openDeleteDialog}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ProfilePageLayout
      activeTab="trajectory"
      title={CERTIFICATIONS_VIEW_TEXTS.pageTitle}
      description={CERTIFICATIONS_VIEW_TEXTS.pageDescription}
    >
      <TrajectorySteps activeStep="certifications" />
      {visibleFeedback ? <FeedbackMessage feedback={visibleFeedback} /> : null}
      {isFormOpen ? (
        <div className="max-w-3xl">
          <CertificationForm
            key={formState.mode === "edit" ? formState.certification.id : formState.mode}
            initialData={
              formState.mode === "edit" ? toFormValues(formState.certification) : undefined
            }
            isPending={isSaving}
            onSubmit={handleSubmit}
            onCancel={closeForm}
          />
        </div>
      ) : (
        <SectionCard
          title={CERTIFICATIONS_VIEW_TEXTS.sectionTitle}
          description={CERTIFICATIONS_VIEW_TEXTS.sectionDescription}
          action={certifications.length > 0 ? addButton : undefined}
        >
          {renderList()}
        </SectionCard>
      )}
      <CertificationDeleteDialog
        certification={pendingDelete}
        isDeleting={deleteMutation.isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteDialog}
      />
    </ProfilePageLayout>
  );
}
