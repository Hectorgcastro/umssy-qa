"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ReviewDetail } from "../types/request-review.types";
import { valuesMatch } from "../utils/compare-values";

interface ContrastField {
  key: string;
  label: string;
  declared: string;
}

function buildFields(detail: ReviewDetail): ContrastField[] {
  return [
    { key: "firstName", label: "Nombres", declared: detail.firstName },
    { key: "lastName", label: "Apellidos", declared: detail.lastName },
    { key: "idCardNumber", label: "Carnet de identidad", declared: detail.idCardNumber },
    { key: "sisCode", label: "Código SIS", declared: detail.sisCode },
    { key: "career", label: "Carrera", declared: detail.career },
    { key: "graduationYear", label: "Año de titulación", declared: String(detail.graduationYear) },
  ];
}

// Mientras la lectura automática del documento esté fuera de alcance, la persona revisora escribe el valor que ve en él
// TODO: confirmar con la docente cómo se obtiene el valor del documento
export function DataContrastPanel({ detail }: { detail: ReviewDetail }) {
  const fields = buildFields(detail);
  const [documentValues, setDocumentValues] = useState<Record<string, string>>({});

  const matching = fields.filter((field) => valuesMatch(field.declared, documentValues[field.key] ?? "")).length;

  return (
    <section className="flex flex-col gap-4 rounded-md border border-border bg-surface p-4" aria-label="Contraste de datos">
      <header className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-ink">Contraste de datos</h2>
        <p className="text-sm text-text-secondary">Escribe el valor que ves en el documento para compararlo con lo declarado.</p>
      </header>

      <ul className="flex flex-col gap-4">
        {fields.map((field) => {
          const matches = valuesMatch(field.declared, documentValues[field.key] ?? "");
          return (
            <li key={field.key} className="flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <Label htmlFor={`contrast-${field.key}`}>{field.label}</Label>
                <span className="text-xs font-semibold text-ink">{matches ? "Coincide" : "Por verificar"}</span>
              </div>
              <p className="text-sm text-text-secondary">
                Declarado: <span className="font-medium text-ink">{field.declared}</span>
              </p>
              <Input
                id={`contrast-${field.key}`}
                value={documentValues[field.key] ?? ""}
                onChange={(event) => setDocumentValues((current) => ({ ...current, [field.key]: event.target.value }))}
                placeholder="Valor en el documento"
              />
            </li>
          );
        })}
      </ul>

      <p className="text-sm text-ink" aria-live="polite">
        {matching} {matching === 1 ? "campo coincide" : "campos coinciden"}, {fields.length - matching} por verificar
      </p>
    </section>
  );
}
