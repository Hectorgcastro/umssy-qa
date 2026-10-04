"use client";

import { useState } from "react";
import { saveMentorParticipation } from "@/shared/services/mentor-participation.service";
import { OrientationStep } from "../components/orientation/orientation-step";
import { ParticipationStep } from "../components/participation/participation-step";
import { ConfirmationStep } from "../components/wizard/confirmation-step";
import { MentorshipActivatedSummary } from "../components/wizard/mentorship-activated-summary";
import { MentorshipWizardShell } from "../components/wizard/mentorship-wizard-shell";
import { StepTechnicalAreas } from "../components/wizard/step-technical-areas";
import { ORIENTATION_TYPES } from "../data/orientation-types";
import { TECHNICAL_AREAS } from "../data/technical-areas";
import { useMentorshipWizard } from "../hooks/use-mentorship-wizard";

export function MentorshipView() {
  const {
    currentStep,
    selectedTechnicalAreaIds,
    wantsToParticipate,
    selectedOrientationTypeIds,
    goNext,
    goBack,
    goToStep,
    toggleTechnicalArea,
    canGoBack,
    canGoNext,
    setState,
  } = useMentorshipWizard();

  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const canAdvance =
    currentStep === 1 ? wantsToParticipate : canGoNext;

  const handleParticipationChange = (value: boolean) => {
    setState((prev) => ({
      ...prev,
      wantsToParticipate: value,
    }));
  };

  const handleOrientationChange = (ids: string[]) => {
    setState((prev) => ({
      ...prev,
      selectedOrientationTypeIds: ids,
    }));
  };

  const handleActivate = async () => {
    setIsActivating(true);

    // TODO: Replace the activation delay with the mentorship API integration.
    await new Promise((resolve) => setTimeout(resolve, 500));

    saveMentorParticipation({
      status: "active",
      areas: selectedTechnicalAreas.map((area) => area.name),
      orientations: selectedOrientationTypes.map((orientation) => orientation.label),
    });

    setIsActivating(false);
    setIsActivated(true);
  };

  const selectedTechnicalAreas = TECHNICAL_AREAS.filter((area) =>
    selectedTechnicalAreaIds.includes(area.id),
  );

  const selectedOrientationTypes = ORIENTATION_TYPES.filter((orientation) =>
    selectedOrientationTypeIds.includes(orientation.id),
  );

  if (isActivated) {
    return (
      <MentorshipActivatedSummary
        technicalAreaNames={selectedTechnicalAreas.map((area) => area.name)}
        orientationLabels={selectedOrientationTypes.map(
          (orientation) => orientation.label,
        )}
      />
    );
  }

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <ParticipationStep
          isParticipating={wantsToParticipate}
          onParticipationChange={handleParticipationChange}
        />
      );
    }

    if (currentStep === 2) {
      return (
        <StepTechnicalAreas
          selectedIds={selectedTechnicalAreaIds}
          onToggle={toggleTechnicalArea}
        />
      );
    }

    if (currentStep === 3) {
      return (
        <OrientationStep
          selectedOrientationTypeIds={selectedOrientationTypeIds}
          onSelectionChange={handleOrientationChange}
        />
      );
    }

    return (
      <ConfirmationStep
        wantsToParticipate={wantsToParticipate}
        selectedTechnicalAreaIds={selectedTechnicalAreaIds}
        selectedOrientationTypeIds={selectedOrientationTypeIds}
        isActivating={isActivating}
        onEditTechnicalAreas={() => goToStep(2)}
        onEditOrientationTypes={() => goToStep(3)}
        onActivate={handleActivate}
      />
    );
  };

  return (
    <MentorshipWizardShell
      currentStep={currentStep}
      canGoBack={canGoBack}
      canAdvance={canAdvance}
      onBack={goBack}
      onNext={goNext}
    >
      {renderStepContent()}
    </MentorshipWizardShell>
  );
}
