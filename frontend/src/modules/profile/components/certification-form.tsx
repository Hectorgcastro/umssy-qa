"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { CertificationDocumentChange } from "../types/certification-document-change.types";
import type { CertificationErrors } from "../types/certification-errors.types";
import type { CertificationFormProps } from "../types/certification-form-props.types";
import type { CreateCertificationDto } from "../types/create-certification-dto.types";
import { getFieldErrorProps } from "../utils/get-field-error-props";
import { trimFormValues } from "../utils/trim-form-values";
import { validateCertificateFile } from "../utils/validate-certificate-file";
import { getTodayIsoDate, validateCertification } from "../utils/validate-certification";
import { CertificationDocumentField } from "./certification-document-field";
import { FormField } from "./form-field";
import { SectionCard } from "./section-card";

const EMPTY_CERTIFICATION_VALUES: CreateCertificationDto = {
  name: "",
  issuingOrganization: "",
  issueDate: "",
};

export function CertificationForm({
  initialData,
  hasDocument = false,
  isPending = false,
  onSubmit,
  onCancel,
}: CertificationFormProps) {
  const [values, setValues] = useState<CreateCertificationDto>(
    initialData ?? EMPTY_CERTIFICATION_VALUES,
  );
  const [errors, setErrors] = useState<CertificationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCurrentDocumentRemoved, setIsCurrentDocumentRemoved] = useState(false);
  const [fileError, setFileError] = useState<string | undefined>();
  const isEditing = Boolean(initialData);
  const isBusy = isPending || isSubmitting;
  const title = isEditing ? "Editar certificación" : "Agregar certificación";
  const hasCurrentDocument = hasDocument && !isCurrentDocumentRemoved;

  const getDocumentChange = (): CertificationDocumentChange => {
    if (selectedFile) {
      return { type: "replace", file: selectedFile };
    }
    return hasDocument && isCurrentDocumentRemoved ? { type: "remove" } : { type: "keep" };
  };

  const handleSelectFile = (file: File) => {
    const validationError = validateCertificateFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }
    setSelectedFile(file);
    setFileError(undefined);
  };

  const handleRemoveDocument = () => {
    if (selectedFile) {
      setSelectedFile(null);
    } else {
      setIsCurrentDocumentRemoved(true);
    }
    setFileError(undefined);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const field = event.target.name as keyof CreateCertificationDto;
    const { value } = event.target;
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleCancel = () => {
    setValues(initialData ?? EMPTY_CERTIFICATION_VALUES);
    setErrors({});
    setSelectedFile(null);
    setIsCurrentDocumentRemoved(false);
    setFileError(undefined);
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
      await onSubmit(trimmedValues, getDocumentChange());
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
          <Input
            id="certification-name"
            name="name"
            type="text"
            placeholder="Ej. AWS Certified Cloud Practitioner"
            value={values.name}
            disabled={isBusy}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
            {...getFieldErrorProps("certification-name", errors.name)}
          />
        </FormField>
        <FormField
          id="certification-issuingOrganization"
          label="Organización emisora"
          isRequired
          error={errors.issuingOrganization}
        >
          <Input
            id="certification-issuingOrganization"
            name="issuingOrganization"
            type="text"
            placeholder="Ej. Amazon Web Services"
            value={values.issuingOrganization}
            disabled={isBusy}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
            {...getFieldErrorProps("certification-issuingOrganization", errors.issuingOrganization)}
          />
        </FormField>
        <FormField
          id="certification-issueDate"
          label="Fecha de emisión"
          isRequired
          error={errors.issueDate}
        >
          <Input
            id="certification-issueDate"
            name="issueDate"
            type="date"
            max={getTodayIsoDate()}
            value={values.issueDate}
            disabled={isBusy}
            onChange={handleChange}
            className="w-full rounded-lg border border-border bg-surface px-4 text-[15px] text-ink placeholder:text-text-secondary/70 focus:border-ink-soft focus:ring-2 focus:ring-ink/10 focus:outline-none disabled:opacity-60 aria-invalid:border-accent aria-invalid:focus:ring-accent/15 h-12 md:text-[15px] focus-visible:border-ink-soft focus-visible:ring-2 focus-visible:ring-ink/10 aria-invalid:ring-0"
            {...getFieldErrorProps("certification-issueDate", errors.issueDate)}
          />
        </FormField>
        <CertificationDocumentField
          selectedFile={selectedFile}
          hasCurrentDocument={hasCurrentDocument}
          error={fileError}
          disabled={isBusy}
          onSelectFile={handleSelectFile}
          onRemove={handleRemoveDocument}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            className="h-12 border-border-strong bg-surface px-6 text-[14px] font-semibold text-ink hover:bg-surface-soft"
            disabled={isBusy}
            onClick={handleCancel}
          >
            Cancelar
          </Button>
          <Button type="submit" className={cn("h-12 bg-accent px-6 text-[14px] font-semibold text-white hover:bg-danger", "min-w-44")} disabled={isBusy}>
            {isBusy ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
            {isBusy ? "Guardando..." : "Guardar"}
          </Button>
        </div>
      </form>
    </SectionCard>
  );
}
