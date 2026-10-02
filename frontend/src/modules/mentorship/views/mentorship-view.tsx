"use client";

import { ProgressStepper } from "../components/progress-stepper";
import { StepTechnicalAreas } from "../components/step-technical-areas";
import { useMentorshipWizard } from "../hooks/use-mentorship-wizard";
import { MENTORSHIP_STEPS } from "../types/mentorship.types";

export function MentorshipView() {
  const {
    currentStep,
    selectedTechnicalAreaIds,
    goNext,
    goBack,
    toggleTechnicalArea,
    canGoBack,
    canGoNext,
  } = useMentorshipWizard();

  const currentStepDefinition = MENTORSHIP_STEPS[currentStep - 1];

  const renderStepContent = () => {
    if (currentStep === 2) {
      return (
        <StepTechnicalAreas
          selectedIds={selectedTechnicalAreaIds}
          onToggle={toggleTechnicalArea}
        />
      );
    }

    // Placeholder para los otros pasos (T2, T4, T5)
    return (
      <div>
        <p className="text-sm font-semibold text-ink">
          Paso {currentStep}: {currentStepDefinition.label}
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          {currentStepDefinition.description}
        </p>
      </div>
    );
  };

  return (
    <main className="min-h-full bg-surface-soft px-4 py-6 sm:py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 sm:gap-8">
        <ProgressStepper currentStep={currentStep} />

        <section className="rounded-lg border border-border bg-surface p-4 shadow-sm sm:p-6">
          <header className="mb-6">
            <h1 className="font-tight text-xl font-bold text-ink sm:text-2xl">
              Participa como mentor
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              Configura tu participación como mentor.
            </p>
          </header>

          <div className="min-h-48 rounded-md border border-border bg-surface-soft p-4 sm:p-6">
            {renderStepContent()}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={!canGoBack}
              className="rounded-md border border-border-strong px-4 py-2.5 text-sm font-semibold text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              ← Volver
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={!canGoNext}
              className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuar →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}