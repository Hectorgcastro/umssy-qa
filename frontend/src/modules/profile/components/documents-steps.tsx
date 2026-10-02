import { cn } from "@/lib/utils";
import { DOCUMENTS_STEPS } from "../config/documents-steps.config";
import type { DocumentsStepsProps } from "../types/documents-steps-props.types";

export function DocumentsSteps({ activeStep }: DocumentsStepsProps) {
  return (
    <ol aria-label="Pasos de documentos" className="mb-8 flex gap-10">
      {DOCUMENTS_STEPS.map((step) => {
        const isActive = step.id === activeStep;

        return (
          <li
            key={step.id}
            aria-current={isActive ? "step" : undefined}
            className={cn(
              "flex items-center gap-3 text-[15px]",
              isActive ? "font-semibold text-ink" : "text-text-secondary",
            )}
          >
            <span
              className={cn(
                "font-tight text-[20px] font-bold",
                isActive ? "text-accent" : "text-border-strong",
              )}
            >
              {step.number}
            </span>
            <span>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
