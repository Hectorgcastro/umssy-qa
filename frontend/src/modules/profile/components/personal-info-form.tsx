"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  INPUT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from "../config/form-styles.config";
import type { PersonalInfoFormProps } from "../types/personal-info-form-props.types";
import type { PersonalInfoValues } from "../types/personal-info-values.types";
import { trimFormValues } from "../utils/trim-form-values";
import { FormField } from "./form-field";
import { ProfilePhotoField } from "./profile-photo-field";
import { SectionCard } from "./section-card";

export function PersonalInfoForm({
  initialValues,
  cities,
  isSaving = false,
  onSubmit,
}: PersonalInfoFormProps) {
  const [values, setValues] = useState<PersonalInfoValues>(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const field = event.target.name as keyof PersonalInfoValues;
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
    <SectionCard
      title="Tu información personal"
      description="Completa los campos para crear tu perfil. Podrás editarlos más adelante."
    >
      <ProfilePhotoField />

      <form onSubmit={handleSubmit} className="flex flex-col gap-8 pt-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <FormField id="firstName" label="Nombres" isRequired>
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              placeholder="Escribe tus nombres"
              value={values.firstName}
              disabled={isSaving}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </FormField>
          <FormField id="lastName" label="Apellidos" isRequired>
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              placeholder="Escribe tus apellidos"
              value={values.lastName}
              disabled={isSaving}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </FormField>
          <FormField id="cityId" label="Ciudad de residencia" isRequired>
            <select
              id="cityId"
              name="cityId"
              value={values.cityId}
              disabled={isSaving}
              onChange={handleChange}
              className={INPUT_CLASS}
            >
              <option value="">Selecciona tu ciudad</option>
              {cities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.title}
                </option>
              ))}
            </select>
          </FormField>
          <FormField id="phone" label="Teléfono" isRequired>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="Ej. +591 700 00000"
              value={values.phone}
              disabled={isSaving}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </FormField>
          <FormField id="personalEmail" label="Correo personal" isRequired>
            <input
              id="personalEmail"
              name="personalEmail"
              type="email"
              autoComplete="email"
              placeholder="nombre@correo.com"
              value={values.personalEmail}
              disabled={isSaving}
              onChange={handleChange}
              className={INPUT_CLASS}
            />
          </FormField>
        </div>

        <div className="flex items-center justify-between gap-6">
          <p className="text-[13px] text-text-secondary">* Campos obligatorios</p>
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
            <Button type="submit" className={cn(PRIMARY_BUTTON_CLASS, "min-w-44")} disabled={isSaving}>
              {isSaving ? "Guardando..." : "Guardar perfil"}
            </Button>
          </div>
        </div>
      </form>
    </SectionCard>
  );
}
