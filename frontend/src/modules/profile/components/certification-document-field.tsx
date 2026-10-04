"use client";

import { useRef, type ChangeEvent } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CERTIFICATE_FILE_ACCEPT,
  CERTIFICATION_DOCUMENT_LABELS,
} from "../config/certification-document.config";
import type { CertificationDocumentFieldProps } from "../types/certification-document-field-props.types";
import { formatFileSize } from "../utils/format-file-size";
import { getFieldErrorProps } from "../utils/get-field-error-props";
import { FormField } from "./form-field";

const DOCUMENT_INPUT_ID = "certification-document";

export function CertificationDocumentField({
  selectedFile,
  hasCurrentDocument,
  error,
  disabled = false,
  onSelectFile,
  onRemove,
}: CertificationDocumentFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasDocument = selectedFile !== null || hasCurrentDocument;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      onSelectFile(file);
    }
  };

  const getDescription = () => {
    if (selectedFile) {
      return `${selectedFile.name} · ${formatFileSize(selectedFile.size)}`;
    }
    return hasCurrentDocument
      ? CERTIFICATION_DOCUMENT_LABELS.currentDocument
      : CERTIFICATION_DOCUMENT_LABELS.hint;
  };

  return (
    <FormField id={DOCUMENT_INPUT_ID} label={CERTIFICATION_DOCUMENT_LABELS.field} error={error}>
      <input
        ref={fileInputRef}
        id={DOCUMENT_INPUT_ID}
        type="file"
        accept={CERTIFICATE_FILE_ACCEPT}
        aria-label={CERTIFICATION_DOCUMENT_LABELS.fileInput}
        hidden
        disabled={disabled}
        onChange={handleFileChange}
        {...getFieldErrorProps(DOCUMENT_INPUT_ID, error)}
      />
      <div className="flex items-center justify-between gap-4 rounded-lg border border-dashed border-border-strong bg-surface-soft px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <FileText aria-hidden="true" className="size-5 shrink-0 text-ink-soft" />
          <p className="text-[13px] break-all text-text-secondary">{getDescription()}</p>
        </div>
        <div className="flex shrink-0 gap-2">
          {hasDocument ? (
            <Button
              type="button"
              variant="ghost"
              className="h-10 px-3 text-[13px] font-semibold text-accent hover:bg-interaction hover:text-accent"
              disabled={disabled}
              onClick={onRemove}
            >
              {CERTIFICATION_DOCUMENT_LABELS.remove}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="h-10 border-border-strong bg-surface px-4 text-[13px] font-semibold text-ink hover:bg-surface-soft"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
          >
            {hasDocument ? CERTIFICATION_DOCUMENT_LABELS.replace : CERTIFICATION_DOCUMENT_LABELS.select}
          </Button>
        </div>
      </div>
    </FormField>
  );
}
