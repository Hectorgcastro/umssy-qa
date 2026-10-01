"use client";

import { useState } from "react";
import { ProgressStepper } from "../components/progress-stepper";
import {
  MENTORSHIP_STEPS,
  type MentorshipStep,
} from "../types/mentorship.types";

export function MentorshipView() {
  const [currentStep, setCurrentStep] = useState<MentorshipStep>(1);

  const canGoBack = currentStep > 1;
  const canGoNext = currentStep < 4;

  const handleBack = () => {
    if (canGoBack) {
      setCurrentStep((step) => (step - 1) as MentorshipStep);
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentStep((step) => (step + 1) as MentorshipStep);
    }
  };

  const currentStepDefinition = MENTORSHIP_STEPS[currentStep - 1];

  return (
    <main className="min-h-full bg-surface-soft px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
        <ProgressStepper currentStep={currentStep} />

        <section className="rounded-lg border border-border bg-surface p-6 shadow-sm">
          <div className="mb-6">
            <h1 className="font-tight text-2xl font-bold text-ink">
              Participa como mentor
            </h1>

            <p className="mt-2 text-sm text-text-secondary">
              Configura tu participación como mentor.
            </p>
          </div>

          <div className="min-h-48 rounded-md border border-border bg-surface-soft p-6">
            <p className="text-sm font-semibold text-ink">
              Paso {currentStep}: {currentStepDefinition.label}
            </p>

            <p className="mt-2 text-sm text-text-secondary">
              {currentStepDefinition.description}
            </p>
          </div>

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={!canGoBack}
              className="rounded-md border border-border-strong px-4 py-2 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Volver
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!canGoNext}
              className="rounded-md bg-accent px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuar →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}