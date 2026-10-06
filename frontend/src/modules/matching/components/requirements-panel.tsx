import { CheckCircle2, CircleAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RequirementsPanelProps } from "../types/requirements-panel-props.types";

export function RequirementsPanel({ gap }: RequirementsPanelProps) {
  const groups = [
    { title: "Habilidades requeridas", requirements: gap.skills },
    { title: "Requisitos académicos", requirements: gap.academicRequirements },
    { title: "Experiencia", requirements: gap.experienceRequirements },
    { title: "Otros requisitos", requirements: gap.otherRequirements },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Habilidades y requisitos faltantes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {gap.complete ? (
          <p role="status" className="text-emerald-700">
            Para esta oportunidad no tienes habilidades ni requisitos pendientes
          </p>
        ) : null}
        {groups
          .filter(({ requirements }) => requirements.length > 0)
          .map(({ title, requirements }) => (
            <section key={title} className="space-y-2">
              <h3 className="font-semibold">{title}</h3>
              <ul className="space-y-2">
                {requirements.map(({ name, status }) => (
                  <li key={name} className="flex items-start gap-2 text-sm">
                    {status === "Cumple" ? (
                      <CheckCircle2
                        aria-hidden="true"
                        className="size-4 shrink-0 text-emerald-700"
                      />
                    ) : (
                      <CircleAlert
                        aria-hidden="true"
                        className="size-4 shrink-0 text-amber-700"
                      />
                    )}
                    <span className="min-w-0 break-words">
                      {name} — <strong>{status}</strong>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </CardContent>
    </Card>
  );
}
