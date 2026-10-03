"use client";

import { useState, useCallback } from "react";
import type {
  MentorshipStep,
  MentorshipWizardState,
} from "../types/mentorship.types";

const INITIAL_STATE: MentorshipWizardState = {
  currentStep: 1,
  wantsToParticipate: false,
  selectedTechnicalAreaIds: [],
  selectedOrientationTypeIds: [],
};

export function useMentorshipWizard() {
  const [state, setState] = useState<MentorshipWizardState>(INITIAL_STATE);

  const goToStep = useCallback((step: MentorshipStep) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep >= 4) return prev;
      return { ...prev, currentStep: (prev.currentStep + 1) as MentorshipStep };
    });
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      if (prev.currentStep <= 1) return prev;
      return { ...prev, currentStep: (prev.currentStep - 1) as MentorshipStep };
    });
  }, []);

  const toggleTechnicalArea = useCallback((id: string) => {
    setState((prev) => {
      const alreadySelected = prev.selectedTechnicalAreaIds.includes(id);
      const selectedTechnicalAreaIds = alreadySelected
        ? prev.selectedTechnicalAreaIds.filter((areaId) => areaId !== id)
        : [...prev.selectedTechnicalAreaIds, id];

      return { ...prev, selectedTechnicalAreaIds };
    });
  }, []);

  const canGoNextFromStep2 = state.selectedTechnicalAreaIds.length > 0;

  return {
    ...state,
    goToStep,
    goNext,
    goBack,
    toggleTechnicalArea,
    canGoBack: state.currentStep > 1,
    // En el paso 2 se exige al menos un area tecnica seleccionada
    canGoNext:
      state.currentStep === 2
        ? canGoNextFromStep2
        : state.currentStep < 4,
    setState,
  };
}