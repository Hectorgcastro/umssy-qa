"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  INPUT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
  TEXTAREA_CLASS,
} from "../config/form-styles.config";
import type { PresentationFormProps } from "../types/presentation-form-props.types";
import type { PresentationValues } from "../types/presentation-values.types";
import { trimFormValues } from "../utils/trim-form-values";
import { FormField } from "./form-field";
import { ProfilePreviewCard } from "./profile-preview-card";
import { SectionCard } from "./section-card";
import { WritingTipsCard } from "./writing-tips-card";

export function PresentationForm({
  initialValues,
  fullName,
  isSaving = false,
  onSubmit,
}: PresentationFormProps) {
  const [values, setValues] = useState<PresentationValues>(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = event.target.name as keyof PresentationValues;
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleCancel = () => {
    setValues(initialValues);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(trimFormValues(values));
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_380px] items-start gap-6">
      <SectionCard
        title="Escribe tu presentación"
        description="Un resumen claro ayuda a entender qué haces y qué buscas."
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <FormField id="headline" label="Titular profesional" isRequired>
            <input
              id="headline"
              name="headline"
              type="text"
              placeholder="Ej. Desarrolladora web junior"
              value={values.headline}
              disabled={isSaving}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </FormField>
          <FormField id="aboutMe" label="Acerca de" isRequired>
            <textarea
              id="aboutMe"
              name="aboutMe"
              rows={6}
              placeholder="Cuenta quién eres y en qué te especializas."
              value={values.aboutMe}
              disabled={isSaving}
              onChange={handleChange}
              className={TEXTAREA_CLASS}
            />
          </FormField>
          <FormField id="interestedOpportunities" label="Oportunidades que me interesan">
            <textarea
              id="interestedOpportunities"
              name="interestedOpportunities"
              rows={3}
              placeholder="Ej. Prácticas o empleo en desarrollo frontend, trabajo remoto."
              value={values.interestedOpportunities}
              disabled={isSaving}
              onChange={handleChange}
              className={TEXTAREA_CLASS}
            />
          </FormField>

          <div className="flex items-center justify-between gap-6 pt-3">
            <p className="text-[13px] text-text-secondary">
              Estos textos aparecerán en tu perfil público.
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className={SECONDARY_BUTTON_CLASS}
                disabled={isSaving}
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button type="submit" className={cn(PRIMARY_BUTTON_CLASS, "min-w-52")} disabled={isSaving}>
                {isSaving ? "Guardando..." : "Guardar presentación"}
              </Button>
            </div>
          </div>
        </form>
      </SectionCard>

      <div className="flex flex-col gap-6">
        <ProfilePreviewCard fullName={fullName} presentation={values} />
        <WritingTipsCard />
      </div>
    </div>
  );
}
