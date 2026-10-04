"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { EMPTY_EDUCATION_FORM_VALUES } from "../config/education-form-defaults.config";
import type { EducationFormProps } from "../types/education-form-props.types";
import type { EducationFormValues } from "../types/education-form-values.types";
import { FeedbackMessage } from "./feedback-message";
import { FormField } from "./form-field";
import { SectionCard } from "./section-card";

export function EducationForm({
  initialValues,
  isPending = false,
  feedback = null,
  onSubmit,
  onCancel,
}: EducationFormProps) {
  const [values, setValues] = useState<EducationFormValues>(
    initialValues ?? EMPTY_EDUCATION_FORM_VALUES,
  );
  const title = initialValues ? "Editar formación" : "Agregar formación";

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <SectionCard title={title}>
      <form aria-label={title} noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField id="education-institution" label="Institución" isRequired>
          <Input
            id="education-institution"
            name="institution"
            type="text"
            required
            placeholder="Nombre de la institución"
            value={values.institution}
            disabled={isPending}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
          />
        </FormField>
        <FormField id="education-degree" label="Título o carrera" isRequired>
          <Input
            id="education-degree"
            name="degree"
            type="text"
            required
            placeholder="Ej. Licenciatura en Informática"
            value={values.degree}
            disabled={isPending}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-5">
          <FormField id="education-startDate" label="Desde" isRequired>
            <Input
              id="education-startDate"
              name="startDate"
              type="date"
              required
              value={values.startDate}
              disabled={isPending}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
            />
          </FormField>
          <FormField id="education-endDate" label="Hasta" isRequired>
            <Input
              id="education-endDate"
              name="endDate"
              type="date"
              required
              value={values.endDate}
              disabled={isPending}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
            />
          </FormField>
        </div>
        <FormField id="education-description" label="Descripción (opcional)">
          <Textarea
            id="education-description"
            name="description"
            rows={3}
            placeholder="Agrega un detalle relevante de tus estudios"
            value={values.description}
            disabled={isPending}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 resize-y py-3 field-sizing-fixed min-h-0 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
          />
        </FormField>

        <FeedbackMessage feedback={feedback} />
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="h-12 border-border-strong bg-surface px-6 text-[14px] font-semibold text-ink hover:bg-surface-soft"
            disabled={isPending}
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className={cn("h-12 bg-accent px-6 text-[14px] font-semibold text-white hover:bg-danger", "min-w-44")}
            disabled={isPending}
          >
            {isPending ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
            {isPending ? "Guardando..." : "Guardar formación"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
