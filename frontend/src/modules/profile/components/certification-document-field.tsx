"use client";

import { useRef, type ChangeEvent } from "react";
import { FileText, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CERTIFICATE_FILE_ACCEPT } from "../config/certification-document.config";
import type { CertificationDocumentFieldProps } from "../types/certification-document-field-props.types";
import { formatFileSize } from "../utils/format-file-size";
import { getFieldErrorProps } from "../utils/get-field-error-props";
import { FormField } from "./form-field";

const DOCUMENT_INPUT_ID = "certification-document";

export function CertificationDocumentField({
  selectedFile,
  error,
  disabled = false,
  isUploading = false,
  onSelectFile,
  onClearFile,
}: CertificationDocumentFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) {
      onSelectFile(file);
    }
  };

  return (
    <FormField id={DOCUMENT_INPUT_ID} label="Archivo de respaldo" isRequired error={error}>
      <Input
        ref={fileInputRef}
        id={DOCUMENT_INPUT_ID}
        type="file"
        accept={CERTIFICATE_FILE_ACCEPT}
        className="hidden"
        disabled={disabled}
        onChange={handleFileChange}
        {...getFieldErrorProps(DOCUMENT_INPUT_ID, error)}
      />
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-dashed border-border-strong bg-surface-soft px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <FileText aria-hidden="true" className="size-5 shrink-0 text-ink-soft" />
          <p className="text-[13px] break-all text-text-secondary">
            {selectedFile
              ? `${selectedFile.name} · ${formatFileSize(selectedFile.size)}`
              : "PDF, JPG o PNG - Selecciona el documento o imagen."}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {selectedFile ? (
            <Button
              type="button"
              variant="outline"
              aria-label="Quitar archivo seleccionado"
              className="h-10 shrink-0 border-border-strong bg-surface px-4 text-[13px] font-semibold text-ink hover:bg-surface-soft"
              disabled={disabled}
              onClick={onClearFile}
            >
              <X aria-hidden="true" className="size-4" />
              Quitar
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="h-10 shrink-0 border-border-strong bg-surface px-4 text-[13px] font-semibold text-ink hover:bg-surface-soft"
            disabled={disabled}
            onClick={() => fileInputRef.current?.click()}
          >
            {selectedFile ? "Reemplazar archivo" : "Seleccionar archivo"}
          </Button>
        </div>
      </div>
      {isUploading && selectedFile ? (
        <p role="status" className="flex items-center gap-2 text-[13px] text-text-secondary">
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
          Subiendo documento...
        </p>
      ) : null}
    </FormField>
  );
}
