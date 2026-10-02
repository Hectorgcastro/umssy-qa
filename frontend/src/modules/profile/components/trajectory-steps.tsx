import { cn } from "@/lib/utils";

// Numbered sub-tab navigator for the Trayectoria section.
// Mirrors the visual pattern of DocumentsSteps: bold number + label, active in accent color.

type TrajectoryStepId = "education" | "experience" | "skills" | "certifications";

interface TrajectoryStep {
  id: TrajectoryStepId;
  number: string;
  label: string;
}

interface TrajectoryStepsProps {
  activeStep?: TrajectoryStepId;
}

const TRAJECTORY_STEPS: TrajectoryStep[] = [
  { id: "education", number: "01", label: "Formación académica" },
  { id: "experience", number: "02", label: "Experiencia laboral" },
  { id: "skills", number: "03", label: "Habilidades" },
  { id: "certifications", number: "04", label: "Certificaciones" },
];

export function TrajectorySteps({ activeStep = "education" }: TrajectoryStepsProps) {
  return (
    <ol aria-label="Sub-secciones de trayectoria" className="mb-8 flex gap-10">
      {TRAJECTORY_STEPS.map((step) => {
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
