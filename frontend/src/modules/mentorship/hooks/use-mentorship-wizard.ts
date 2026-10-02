"use client";

import { useState, useCallback } from "react";
import type { MentorshipStep, MentorshipWizardState } from "../types/mentorship.types";

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

  return {
    ...state,
    goToStep,
    goNext,
    goBack,
    canGoBack: state.currentStep > 1,
    canGoNext: state.currentStep < 4,
    // setState se exportará más adelante cuando se necesite mutar selecciones
    setState,
  };
}