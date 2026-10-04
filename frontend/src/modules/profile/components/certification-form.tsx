"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  INPUT_CLASS,
  PRIMARY_BUTTON_CLASS,
  SECONDARY_BUTTON_CLASS,
} from "../config/form-styles.config";
import type { CertificationErrors } from "../types/certification-errors.types";
import type { CertificationFormProps } from "../types/certification-form-props.types";
import type { CreateCertificationDto } from "../types/certification.types";
import { getFieldErrorProps } from "../utils/get-field-error-props";
import { trimFormValues } from "../utils/trim-form-values";
import { getTodayIsoDate, validateCertification } from "../utils/validate-certification";
import { FormField } from "./form-field";
import { SectionCard } from "./section-card";

const EMPTY_CERTIFICATION_VALUES: CreateCertificationDto = {
  name: "",
  issuingOrganization: "",
  issueDate: "",
};

export function CertificationForm({
  initialData,
  isPending = false,
  onSubmit,
  onCancel,
}: CertificationFormProps) {
  const [values, setValues] = useState<CreateCertificationDto>(
    initialData ?? EMPTY_CERTIFICATION_VALUES,
  );
  const [errors, setErrors] = useState<CertificationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = Boolean(initialData);
  const isBusy = isPending || isSubmitting;
  const title = isEditing ? "Editar certificación" : "Agregar certificación";

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as keyof CreateCertificationDto;
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleCancel = () => {
    setValues(initialData ?? EMPTY_CERTIFICATION_VALUES);
    setErrors({});
    onCancel();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedValues = trimFormValues(values);
    const validationErrors = validateCertification(trimmedValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmedValues);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionCard title={title}>
      <form aria-label={title} noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        <FormField
          id="certification-name"
          label="Nombre de la certificación"
          isRequired
          error={errors.name}
        >
          <input
            id="certification-name"
            name="name"
            type="text"
            placeholder="Ej. AWS Certified Cloud Practitioner"
            value={values.name}
            disabled={isBusy}
            onChange={handleChange}
            className={INPUT_CLASS}
            {...getFieldErrorProps("certification-name", errors.name)}
          />
        </FormField>
        <FormField
          id="certification-issuingOrganization"
          label="Organización emisora"
          isRequired
          error={errors.issuingOrganization}
        >
          <input
            id="certification-issuingOrganization"
            name="issuingOrganization"
            type="text"
            placeholder="Ej. Amazon Web Services"
            value={values.issuingOrganization}
            disabled={isBusy}
            onChange={handleChange}
            className={INPUT_CLASS}
            {...getFieldErrorProps("certification-issuingOrganization", errors.issuingOrganization)}
          />
        </FormField>
        <FormField
          id="certification-issueDate"
          label="Fecha de emisión"
          isRequired
          error={errors.issueDate}
        >
          <input
            id="certification-issueDate"
            name="issueDate"
            type="date"
            max={getTodayIsoDate()}
            value={values.issueDate}
            disabled={isBusy}
            onChange={handleChange}
            className={INPUT_CLASS}
            {...getFieldErrorProps("certification-issueDate", errors.issueDate)}
          />
        </FormField>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className={SECONDARY_BUTTON_CLASS}
            disabled={isBusy}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" className={cn(PRIMARY_BUTTON_CLASS, "min-w-44")} disabled={isBusy}>
            {isBusy ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
            {isBusy ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
