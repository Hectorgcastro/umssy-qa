"use client";

import {
  MENTORSHIP_STEPS,
  type MentorshipStep,
} from "../types/mentorship.types";

interface ProgressStepperProps {
  currentStep: MentorshipStep;
}

export function ProgressStepper({
  currentStep,
}: ProgressStepperProps) {
  return (
    <nav aria-label="Progreso de configuración de mentoría">
      <ol className="grid grid-cols-4 gap-4">
        {MENTORSHIP_STEPS.map((step) => {
          const isActive = step.id === currentStep;
          const isCompleted = step.id < currentStep;

          return (
            <li
              key={step.id}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div
                className={[
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  isActive || isCompleted
                    ? "bg-accent text-white"
                    : "bg-slate-200 text-slate-600",
                ].join(" ")}
                aria-current={isActive ? "step" : undefined}
              >
                {step.id}
              </div>

              <span
                className={[
                  "text-xs font-semibold",
                  isActive ? "text-ink" : "text-text-secondary",
                ].join(" ")}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}