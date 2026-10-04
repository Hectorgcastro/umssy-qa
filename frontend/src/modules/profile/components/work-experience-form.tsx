"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { EMPTY_WORK_EXPERIENCE_FORM_VALUES } from "../config/work-experience-form-defaults.config";
import type { WorkExperienceFormProps } from "../types/work-experience-form-props.types";
import type { WorkExperienceFormValues } from "../types/work-experience-form-values.types";
import { FeedbackMessage } from "./feedback-message";
import { FormField } from "./form-field";
import { SectionCard } from "./section-card";

export function WorkExperienceForm({
  initialValues,
  isPending = false,
  feedback = null,
  onSubmit,
  onCancel,
}: WorkExperienceFormProps) {
  const [values, setValues] = useState<WorkExperienceFormValues>(
    initialValues ?? EMPTY_WORK_EXPERIENCE_FORM_VALUES,
  );
  const isEditing = Boolean(initialValues);
  const title = isEditing ? "Editar experiencia" : "Agregar experiencia";

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleCurrentChange = (checked: boolean) => {
    setValues((current) => ({
      ...current,
      isCurrent: checked,
      endDate: checked ? "" : current.endDate,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <SectionCard title={title}>
      <form aria-label={title} noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField id="work-experience-companyName" label="Empresa" isRequired>
          <Input
            id="work-experience-companyName"
            name="companyName"
            type="text"
            placeholder="Nombre de la empresa"
            value={values.companyName}
            disabled={isPending}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
          />
        </FormField>
        <FormField id="work-experience-position" label="Cargo" isRequired>
          <Input
            id="work-experience-position"
            name="position"
            type="text"
            placeholder="Ej. Desarrollador frontend"
            value={values.position}
            disabled={isPending}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-5">
          <FormField id="work-experience-startDate" label="Desde" isRequired>
            <Input
              id="work-experience-startDate"
              name="startDate"
              type="date"
              value={values.startDate}
              disabled={isPending}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
            />
          </FormField>
          <FormField id="work-experience-endDate" label="Hasta">
            <Input
              id="work-experience-endDate"
              name="endDate"
              type="date"
              value={values.endDate}
              disabled={isPending || values.isCurrent}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
            />
          </FormField>
        </div>
        <label htmlFor="work-experience-isCurrent" className="flex items-center gap-3 text-[14px] text-ink">
          <Checkbox
            id="work-experience-isCurrent"
            name="isCurrent"
            checked={values.isCurrent}
            disabled={isPending}
            onCheckedChange={handleCurrentChange}
            className="size-4 border-border-strong data-checked:border-accent data-checked:bg-accent data-checked:text-white"
          />
          Trabajo actualmente aquí
        </label>
        <FormField id="work-experience-description" label="Descripción de funciones (opcional)">
          <Textarea
            id="work-experience-description"
            name="description"
            rows={4}
            placeholder="Describe las funciones que desempeñaste en este cargo"
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
            {isPending ? "Guardando..." : "Guardar experiencia"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
