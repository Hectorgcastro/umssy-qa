"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FormField } from "./form-field";
import { SectionCard } from "./section-card";

export function EducationForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <SectionCard title="Agregar formación">
      <form
        aria-label="Agregar formación"
        noValidate
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <FormField id="education-institution" label="Institución" isRequired>
          <Input
            id="education-institution"
            name="institution"
            type="text"
            required
            placeholder="Nombre de la institución"
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
            className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
          />
        </FormField>
        <div className="grid grid-cols-2 gap-5">
          <FormField id="education-startDate" label="Desde" isRequired>
            <Input
              id="education-startDate"
              name="startDate"
              type="text"
              required
              placeholder="Mes y año"
              className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
            />
          </FormField>
          <FormField id="education-endDate" label="Hasta" isRequired>
            <Input
              id="education-endDate"
              name="endDate"
              type="text"
              required
              placeholder="Mes y año"
              className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
            />
          </FormField>
        </div>
        <FormField id="education-description" label="Descripción (opcional)">
          <textarea
            id="education-description"
            name="description"
            rows={3}
            placeholder="Agrega un detalle relevante de tus estudios"
            className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 resize-y py-3"
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" className="h-12 border-border-strong bg-surface px-6 text-[14px] font-semibold text-ink hover:bg-surface-soft">
            Cancelar
          </Button>
          <Button type="submit" className={cn("h-12 bg-accent px-6 text-[14px] font-semibold text-white hover:bg-danger", "min-w-44")}>
            Guardar formación
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
